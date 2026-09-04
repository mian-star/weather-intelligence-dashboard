/**
 * Thin, safe wrapper around window.localStorage.
 *
 * Every read is wrapped in try/catch so that corrupted JSON (or a browser that
 * blocks storage entirely) can never crash the app — the caller just gets the
 * fallback value instead.
 */

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    // Corrupted entry or storage unavailable — drop it and fall back.
    console.warn(`[storage] Could not read "${key}", using fallback value.`);
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`[storage] Could not write "${key}".`);
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* nothing we can do */
  }
}
