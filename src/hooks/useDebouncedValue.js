import { useEffect, useState } from 'react';

/**
 * Returns a copy of `value` that only updates after `delay` ms of no changes.
 * Used to throttle live search suggestions so we don't hit the geocoding API on
 * every keystroke.
 */
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
