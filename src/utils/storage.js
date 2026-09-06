/**
 * Thin, safe wrapper around window.localStorage.
 *
 * Every read is wrapped in try/catch so that corrupted JSON (or a browser that
 * blocks storage entirely) can never crash the app — the caller just gets the
 * fallback value instead. A stored value can also be *valid* JSON but the
 * *wrong shape* (e.g. `"not an array"` for a key whose fallback is `[]`) —
 * that isn't a parse error, so it also needs an explicit shape check against
 * `fallback`, or callers like `favorites.some(...)` would throw a TypeError
 * on every render instead of just falling back.
 */

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      console.warn(`[storage] "${key}" was not an array, using fallback value.`);
      return fallback;
    }
    return parsed;
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
