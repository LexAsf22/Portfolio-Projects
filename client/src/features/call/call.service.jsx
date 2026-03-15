// features/call/call.service.js
// Manages the lifecycle of RTCPeerConnection objects for every remote peer.
//
// Responsibilities:
//  • Create / reuse RTCPeerConnection instances (one per remote peer)
//  • Add local tracks to each connection
//  • Drive offer/answer/ICE-candidate exchange via the provided publish fn
//  • Buffer ICE candidates that arrive before remoteDescription is set
//  • Handle ICE disconnection / failure with auto-restart and timeout teardown
//  • Expose a clean removePeer() teardown path
//
// This is NOT a React hook — it is a plain class so its logic can be
// tested without a React tree.  CallOverlay.jsx owns the instance.

import { ICE_CONFIG }        from "../../shared/constants/webrtc";
import { SIGNAL_TYPES, CALL_ROOM, PEER_DISCONNECT_TIMEOUT_MS } from "./call.constants";
import { buildSignalPayload, shouldInitiate, startSpeakerDetection } from "./call.utils";

export class CallService {
  /**
   * @param {object} options
   * @param {string}                        options.myName
   * @param {"voice"|"video"}               options.mode
   * @param {(payload: object) => void}     options.publish       — sends a STOMP signal
   * @param {(peerId: string, stream: MediaStream) => void} options.onRemoteStream
   * @param {(peerId: string) => void}      options.onPeerRemoved
   * @param {(peerId: string) => void}      options.onSpeaking
   * @param {() => void}                   options.onFirstConnect — called once on first track
   */
  constructor({ myName, mode, publish, onRemoteStream, onPeerRemoved, onSpeaking, onFirstConnect }) {
    this.myName          = myName;
    this.mode            = mode;
    this.publish         = publish;
    this.onRemoteStream  = onRemoteStream;
    this.onPeerRemoved   = onPeerRemoved;
    this.onSpeaking      = onSpeaking;
    this.onFirstConnect  = onFirstConnect;

    // { [peerId]: { pc, makingOffer, offerProcessing, answerSent,
    //               pendingCandidates, remoteDescSet } }
    this._peers          = {};
    this._disconnectTimers = {};
    this._speakerCleanups  = {};
    this._localStream    = null;
    this._firstConnected = false;
  }

  // ── Local stream ────────────────────────────────────────────────────────────

  setLocalStream(stream) {
    this._localStream = stream;
  }

  // ── Peer creation ───────────────────────────────────────────────────────────

  /**
   * Returns an existing RTCPeerConnection for peerId, or creates one.
   * If asInitiator is true, immediately creates and sends an offer.
   *
   * @param {string}  peerId
   * @param {boolean} asInitiator
   * @returns {RTCPeerConnection}
   */
  createPeer(peerId, asInitiator) {
    if (this._peers[peerId]?.pc) return this._peers[peerId].pc;

    const pc = new RTCPeerConnection(ICE_CONFIG);
    this._peers[peerId] = {
      pc,
      makingOffer:      false,
      offerProcessing:  false,
      answerSent:       false,
      pendingCandidates: [],
      remoteDescSet:    false,
    };

    // Add local tracks
    if (this._localStream) {
      this._localStream.getTracks().forEach(t => pc.addTrack(t, this._localStream));
    }

    // Remote track
    pc.ontrack = (e) => {
      if (!e.streams[0]) return;
      this.onRemoteStream(peerId, e.streams[0]);

      if (!this._firstConnected) {
        this._firstConnected = true;
        this.onFirstConnect?.();
      }

      // Active-speaker detection — clean up previous if any
      this._speakerCleanups[peerId]?.();
      this._speakerCleanups[peerId] = startSpeakerDetection(
        e.streams[0], peerId, this.onSpeaking
      );
    };

    // ICE candidate
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.publish(buildSignalPayload(this.myName, {
          target:   peerId,
          type:     SIGNAL_TYPES.ICE,
          payload:  JSON.stringify(e.candidate),
        }));
      }
    };

    // ICE state changes
    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;

      if (state === "disconnected") {
        clearTimeout(this._disconnectTimers[peerId]);
        this._disconnectTimers[peerId] = setTimeout(() => {
          if (["disconnected", "failed"].includes(pc.iceConnectionState)) {
            this.removePeer(peerId);
          }
        }, PEER_DISCONNECT_TIMEOUT_MS);
        if (asInitiator) pc.restartIce();
      } else if (state === "failed") {
        asInitiator ? pc.restartIce() : this.removePeer(peerId);
      } else if (state === "connected" || state === "completed") {
        clearTimeout(this._disconnectTimers[peerId]);
      }
    };

    // Send offer if we are the initiator
    if (asInitiator) {
      this._sendOffer(peerId, pc);
    }

    return pc;
  }

  // ── Offer ───────────────────────────────────────────────────────────────────

  async _sendOffer(peerId, pc) {
    const state = this._peers[peerId];
    if (!state) return;
    try {
      state.makingOffer = true;
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.mode === "video",
      });
      await pc.setLocalDescription(offer);
      this.publish(buildSignalPayload(this.myName, {
        target:  peerId,
        type:    SIGNAL_TYPES.OFFER,
        payload: JSON.stringify(offer),
      }));
    } catch (err) {
      console.error("[CallService] createOffer error:", err);
    } finally {
      if (this._peers[peerId]) this._peers[peerId].makingOffer = false;
    }
  }

  // ── Signal handling ─────────────────────────────────────────────────────────

  /**
   * Central dispatcher — called by CallOverlay for every incoming signal.
   * Returns early if the signal is from ourselves or not targeted at us.
   *
   * @param {object} sig   Parsed STOMP message body
   */
  async handleSignal(sig) {
    if (sig.sender === this.myName) return;
    if (sig.target && sig.target !== this.myName) return;

    const peerId = sig.sender;

    switch (sig.type) {
      case SIGNAL_TYPES.PEER_JOIN:
        return this._handlePeerJoin(peerId);

      case SIGNAL_TYPES.PEER_LEAVE:
      case SIGNAL_TYPES.END:
        return this.removePeer(peerId);

      case SIGNAL_TYPES.OFFER:
        return this._handleOffer(peerId, sig);

      case SIGNAL_TYPES.ANSWER:
        return this._handleAnswer(peerId, sig);

      case SIGNAL_TYPES.ICE:
        return this._handleIce(peerId, sig);

      default:
        break;
    }
  }

  _handlePeerJoin(peerId) {
    const initiate = shouldInitiate(this.myName, peerId);
    this.createPeer(peerId, initiate);
    if (!initiate) {
      // Echo back so the joiner knows we exist
      this.publish(buildSignalPayload(this.myName, {
        target: peerId,
        type:   SIGNAL_TYPES.PEER_JOIN,
      }));
    }
  }

  async _handleOffer(peerId, sig) {
    const state = this._peers[peerId] || {};
    if (state.offerProcessing) return;
    state.offerProcessing = true;
    state.answerSent      = false;
    this._peers[peerId]   = state;

    const pc = this.createPeer(peerId, false);
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(sig.payload)));
      state.remoteDescSet = true;
      await this._flushCandidates(peerId, pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      state.answerSent = true;
      this.publish(buildSignalPayload(this.myName, {
        target:  peerId,
        type:    SIGNAL_TYPES.ANSWER,
        payload: JSON.stringify(answer),
      }));
    } catch (err) {
      console.error("[CallService] OFFER handling error:", err);
    } finally {
      state.offerProcessing = false;
    }
  }

  async _handleAnswer(peerId, sig) {
    const state = this._peers[peerId];
    if (!state?.pc) return;
    if (state.pc.signalingState === "stable") return;
    try {
      await state.pc.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(sig.payload))
      );
      state.remoteDescSet = true;
      await this._flushCandidates(peerId, state.pc);
    } catch (err) {
      console.error("[CallService] ANSWER error:", err);
    }
  }

  async _handleIce(peerId, sig) {
    const state     = this._peers[peerId];
    if (!state?.pc) return;
    const candidate = JSON.parse(sig.payload);
    if (state.remoteDescSet) {
      try { await state.pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
    } else {
      state.pendingCandidates = [...(state.pendingCandidates || []), candidate];
    }
  }

  async _flushCandidates(peerId, pc) {
    const state = this._peers[peerId];
    if (!state) return;
    for (const c of (state.pendingCandidates || [])) {
      try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
    }
    state.pendingCandidates = [];
  }

  // ── Teardown ────────────────────────────────────────────────────────────────

  /**
   * Closes and removes a single peer connection.
   *
   * @param {string} peerId
   */
  removePeer(peerId) {
    this._peers[peerId]?.pc?.close();
    delete this._peers[peerId];
    clearTimeout(this._disconnectTimers[peerId]);
    delete this._disconnectTimers[peerId];
    this._speakerCleanups[peerId]?.();
    delete this._speakerCleanups[peerId];
    this.onPeerRemoved(peerId);
  }

  /**
   * Closes every peer connection and resets all state.
   * Call this when the local user leaves the call.
   */
  destroyAll() {
    Object.keys(this._peers).forEach(id => {
      this._peers[id]?.pc?.close();
      clearTimeout(this._disconnectTimers[id]);
      this._speakerCleanups[id]?.();
    });
    this._peers             = {};
    this._disconnectTimers  = {};
    this._speakerCleanups   = {};
    this._firstConnected    = false;
  }

  // ── Accessors ───────────────────────────────────────────────────────────────

  /** Returns an array of currently connected peer IDs. */
  getPeerIds() {
    return Object.keys(this._peers);
  }
}