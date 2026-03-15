// shared/utils/storage.js
// Type-safe, error-tolerant wrappers around localStorage.
//
// Why extract these?
//  • localStorage.getItem returns a raw string; every call-site was doing its
//    own JSON.parse inside a try/catch — now that boilerplate lives here once.
//  • Private-browsing mode and storage-quota errors cause localStorage to
//    throw; the wrappers swallow those so callers don't need to worry.
//  • Makes the app trivially testable — swap this module for an in-memory
//    shim in tests without touching any component.

/**
 * Reads a JSON value from localStorage.
 * Returns `fallback` when the key is absent or the stored value is malformed.
 *
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
export const lsGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Serialises `value` to JSON and writes it to localStorage.
 * Silently ignores errors (private browsing, quota exceeded, etc.).
 *
 * @param {string} key
 * @param {*} value
 */
export const lsSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

/**
 * Removes a key from localStorage.
 * Silently ignores errors.
 *
 * @param {string} key
 */
export const lsRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

/**
 * Convenience: reads a boolean flag stored as the string "true"/"false".
 * localStorage.getItem returns strings, not booleans, so callers that were
 * doing `localStorage.getItem("x") !== "false"` now use this instead.
 *
 * @param {string} key
 * @param {boolean} fallback  Value returned when the key is absent.
 * @returns {boolean}
 */
export const lsGetBool = (key, fallback = false) => {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw !== "false";
};