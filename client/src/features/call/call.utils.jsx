// features/call/call.utils.js
// Pure, side-effect-free helpers that are only relevant to the call feature.
// Nothing here imports React or touches the DOM.

import { CALL_ROOM } from "./call.constants";

// ─── Grid layout ─────────────────────────────────────────────────────────────

/**
 * Calculates the CSS grid dimensions needed to evenly tile `count`
 * participant tiles.  Used by CallOverlay to build its video grid.
 *
 * @param {number} count  Total number of participants (including self)
 * @returns {{ cols: number, rows: number }}
 */
export const calcGridDimensions = (count) => {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
};

// ─── Signal payloads ─────────────────────────────────────────────────────────

/**
 * Builds a base signal payload with all required fields filled in.
 * Callers merge their specific fields on top (type, payload, target).
 *
 * @param {string} sender
 * @param {Partial<SignalPayload>} overrides
 * @returns {SignalPayload}
 */
export const buildSignalPayload = (sender, overrides = {}) => ({
  sender,
  callRoom: CALL_ROOM,
  payload:  "",
  ...overrides,
});

// ─── Peer ordering ────────────────────────────────────────────────────────────

/**
 * Determines which of two peers should initiate the WebRTC offer.
 * Uses alphabetical ordering so both peers independently reach the
 * same decision without a coin-flip negotiation round.
 *
 * Returns true if `localName` should send the offer to `remoteName`.
 *
 * @param {string} localName
 * @param {string} remoteName
 * @returns {boolean}
 */
export const shouldInitiate = (localName, remoteName) =>
  localName > remoteName;

// ─── Active speaker detection ─────────────────────────────────────────────────

/**
 * Attaches a Web Audio analyser to `stream` and calls `onSpeaking(peerId)`
 * whenever the volume crosses the threshold.  Returns a cleanup function
 * that stops the detection loop.
 *
 * Kept here (not in shared) because active-speaker detection is only
 * meaningful inside a call.
 *
 * @param {MediaStream}             stream
 * @param {string}                  peerId
 * @param {(peerId: string) => void} onSpeaking
 * @param {number}                  [threshold=18]
 * @returns {() => void}  cleanup
 */
export const startSpeakerDetection = (stream, peerId, onSpeaking, threshold = 18) => {
  let rafId;
  try {
    const ctx      = new AudioContext();
    const src      = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const check = () => {
      analyser.getByteFrequencyData(data);
      const vol = data.reduce((a, b) => a + b, 0) / data.length;
      if (vol > threshold) onSpeaking(peerId);
      rafId = requestAnimationFrame(check);
    };
    check();

    return () => {
      cancelAnimationFrame(rafId);
      ctx.close().catch(() => {});
    };
  } catch {
    return () => {};
  }
};

// ─── Media constraints ────────────────────────────────────────────────────────

/**
 * Returns the getUserMedia constraints object for a given call mode.
 *
 * @param {"voice"|"video"} mode
 * @returns {MediaStreamConstraints}
 */
export const getMediaConstraints = (mode) =>
  mode === "video"
    ? { audio: true, video: { width: 1280, height: 720, facingMode: "user" } }
    : { audio: true, video: false };