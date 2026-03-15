// features/modals/modal.manager.js
// Centralises all modal open/close state that Chat.jsx previously managed
// as separate boolean flags (showSettings, showProfile, showCreateRoom).
//
// Why a manager?
//  • Three separate booleans in Chat.jsx had no single place to coordinate
//    "close all" behaviour (e.g. on Escape or on logout).
//  • The manager provides a clean API so Chat.jsx never touches modal
//    state directly — it just calls open/close/closeAll.
//  • It also drives the keybind Escape handler: Chat.jsx passes the
//    manager's state to the handler, which calls closeTopmost().
//
// Usage (in Chat.jsx):
//
//   const [modals, modalActions] = useModalManager();
//
//   // open
//   modalActions.open(MODAL_IDS.SETTINGS);
//   modalActions.openSettings("keybinds");   // with tab override
//
//   // close
//   modalActions.close(MODAL_IDS.SETTINGS);
//   modalActions.closeAll();
//
//   // read
//   modals.settings   // boolean
//   modals.settingsTab

import { useState, useCallback } from "react";
import { MODAL_IDS, SETTINGS_TABS } from "./modal.constants";

/**
 * @typedef {object} ModalState
 * @property {boolean} settings
 * @property {boolean} profile
 * @property {boolean} createRoom
 * @property {string}  settingsTab
 */

/**
 * @typedef {object} ModalActions
 * @property {(id: string, tab?: string) => void} open
 * @property {(id: string) => void}               close
 * @property {() => void}                         closeAll
 * @property {() => void}                         closeTopmost
 * @property {(tab: string) => void}              setSettingsTab
 */

/**
 * React hook that owns all modal visibility state.
 * Returns [state, actions] — analogous to useReducer.
 *
 * @returns {[ModalState, ModalActions]}
 */
export const useModalManager = () => {
  const [settings,    setSettings]    = useState(false);
  const [profile,     setProfile]     = useState(false);
  const [createRoom,  setCreateRoom]  = useState(false);
  const [settingsTab, setSettingsTab] = useState(SETTINGS_TABS.ACCOUNT);

  const open = useCallback((id, tab) => {
    if (id === MODAL_IDS.SETTINGS) {
      if (tab) setSettingsTab(tab);
      setSettings(true);
    } else if (id === MODAL_IDS.PROFILE) {
      setProfile(true);
    } else if (id === MODAL_IDS.CREATE_ROOM) {
      setCreateRoom(true);
    }
  }, []);

  const close = useCallback((id) => {
    if (id === MODAL_IDS.SETTINGS)    setSettings(false);
    else if (id === MODAL_IDS.PROFILE)     setProfile(false);
    else if (id === MODAL_IDS.CREATE_ROOM) setCreateRoom(false);
  }, []);

  const closeAll = useCallback(() => {
    setSettings(false);
    setProfile(false);
    setCreateRoom(false);
  }, []);

  // Closes the highest-priority open modal (for Escape key handling).
  // Priority: settings > createRoom > profile
  const closeTopmost = useCallback(() => {
    if (settings)   { setSettings(false);   return; }
    if (createRoom) { setCreateRoom(false);  return; }
    if (profile)    { setProfile(false);     return; }
  }, [settings, createRoom, profile]);

  const state = { settings, profile, createRoom, settingsTab };
  const actions = { open, close, closeAll, closeTopmost, setSettingsTab };

  return [state, actions];
};