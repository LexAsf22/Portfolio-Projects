// features/chat/chat.search.js
// Message search state hook and navigation helpers.
// Isolated from chat.handlers.js because search is a self-contained
// UI sub-feature with its own state slice and keyboard navigation.

import { useState, useCallback } from "react";
import { searchMessages }        from "./chat.utils";

/**
 * @typedef {object} SearchState
 * @property {boolean}  showMsgSearch
 * @property {string}   msgSearchQ
 * @property {number}   msgSearchIdx
 * @property {number[]} msgSearchResults
 */

/**
 * @typedef {object} SearchActions
 * @property {Function} openSearch
 * @property {Function} closeSearch
 * @property {Function} runSearch
 * @property {Function} searchNext
 * @property {Function} searchPrev
 */

/**
 * Hook that owns all message-search state and exposes navigation helpers.
 *
 * @param {React.RefObject} msgRefsRef  Ref map of index → DOM element
 * @param {() => object[]}  getMessages Returns the current message list
 * @returns {[SearchState, SearchActions]}
 */
export const useChatSearch = (msgRefsRef, getMessages) => {
  const [showMsgSearch,     setShowMsgSearch]     = useState(false);
  const [msgSearchQ,        setMsgSearchQ]        = useState("");
  const [msgSearchIdx,      setMsgSearchIdx]      = useState(-1);
  const [msgSearchResults,  setMsgSearchResults]  = useState([]);

  const scrollToHit = useCallback((idx) => {
    msgRefsRef.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [msgRefsRef]);

  const openSearch = useCallback(() => {
    setShowMsgSearch(true);
    setMsgSearchQ("");
    setMsgSearchResults([]);
    setMsgSearchIdx(-1);
  }, []);

  const closeSearch = useCallback(() => {
    setShowMsgSearch(false);
    setMsgSearchQ("");
    setMsgSearchResults([]);
    setMsgSearchIdx(-1);
  }, []);

  const runSearch = useCallback((q) => {
    setMsgSearchQ(q);
    const hits = searchMessages(getMessages(), q);
    setMsgSearchResults(hits);
    const newIdx = hits.length > 0 ? hits.length - 1 : -1;
    setMsgSearchIdx(newIdx);
    if (newIdx >= 0) scrollToHit(hits[newIdx]);
  }, [getMessages, scrollToHit]);

  const searchNext = useCallback(() => {
    if (!msgSearchResults.length) return;
    const next = msgSearchIdx <= 0 ? msgSearchResults.length - 1 : msgSearchIdx - 1;
    setMsgSearchIdx(next);
    scrollToHit(msgSearchResults[next]);
  }, [msgSearchResults, msgSearchIdx, scrollToHit]);

  const searchPrev = useCallback(() => {
    if (!msgSearchResults.length) return;
    const prev = msgSearchIdx >= msgSearchResults.length - 1 ? 0 : msgSearchIdx + 1;
    setMsgSearchIdx(prev);
    scrollToHit(msgSearchResults[prev]);
  }, [msgSearchResults, msgSearchIdx, scrollToHit]);

  const state   = { showMsgSearch, msgSearchQ, msgSearchIdx, msgSearchResults };
  const actions = { openSearch, closeSearch, runSearch, searchNext, searchPrev };

  return [state, actions];
};