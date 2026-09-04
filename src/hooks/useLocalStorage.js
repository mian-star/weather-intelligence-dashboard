import { useCallback, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

/**
 * useState, but the value is mirrored to LocalStorage.
 *
 * - The initial read is lazy (runs once) and guarded, so a corrupted entry
 *   falls back to `initialValue` instead of throwing.
 * - The setter accepts a value or an updater function, like useState, and
 *   writes the result back to storage.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJSON(key, initialValue));

  const setStoredValue = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        writeJSON(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue];
}
