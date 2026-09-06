import { useCallback, useEffect, useMemo, useState } from 'react';
import { SEARCH_HISTORY_LIMIT, STORAGE_KEYS } from '../constants/preferences';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { sameLocation, toStoredLocation } from '../utils/location';
import { LocationContext } from './locationContext';
import { usePreferences } from './preferencesContext';

/**
 * Owns:
 *  - `selectedLocation` — the location the dashboard is showing
 *  - `favorites`        — locations the user deliberately saved
 *  - `searchHistory`    — the last few locations the user looked at
 *
 * Favorites and history are kept as two separate arrays on purpose: they are
 * different concepts (intentional saves vs. recent activity).
 * All three are persisted to LocalStorage via useLocalStorage.
 *
 * `selectedLocation` is the one exception: whether it persists across a
 * refresh is itself a preference ("Remember last location", Settings page),
 * so it lives in plain component state and is only mirrored to LocalStorage
 * when that preference is on.
 */
export function LocationProvider({ children }) {
  const { rememberLastLocation } = usePreferences();
  const [storedLastLocation, setStoredLastLocation] = useLocalStorage(
    STORAGE_KEYS.LAST_LOCATION,
    null,
  );
  const [selectedLocation, setSelectedLocationState] = useState(() =>
    rememberLastLocation ? storedLastLocation : null,
  );
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  const [searchHistory, setSearchHistory] = useLocalStorage(
    STORAGE_KEYS.SEARCH_HISTORY,
    [],
  );

  const addToHistory = useCallback(
    (location) => {
      const entry = toStoredLocation(location);
      if (!entry) return;
      setSearchHistory((current) => {
        // Skip if it matches the most recent entry (no consecutive duplicates).
        if (current[0] && sameLocation(current[0], entry)) return current;
        const withoutEntry = current.filter((item) => !sameLocation(item, entry));
        return [entry, ...withoutEntry].slice(0, SEARCH_HISTORY_LIMIT);
      });
    },
    [setSearchHistory],
  );

  const selectLocation = useCallback(
    (location) => {
      const entry = toStoredLocation(location);
      setSelectedLocationState(entry);
      if (rememberLastLocation) setStoredLastLocation(entry);
      addToHistory(entry);
    },
    [rememberLastLocation, setStoredLastLocation, addToHistory],
  );

  // Turning the preference off also forgets whatever was already on disk.
  useEffect(() => {
    if (!rememberLastLocation) setStoredLastLocation(null);
  }, [rememberLastLocation, setStoredLastLocation]);

  const addFavorite = useCallback(
    (location) => {
      const entry = toStoredLocation(location);
      if (!entry) return;
      setFavorites((current) => {
        if (current.some((item) => sameLocation(item, entry))) return current; // no duplicates
        return [...current, entry];
      });
    },
    [setFavorites],
  );

  const removeFavorite = useCallback(
    (id) => {
      setFavorites((current) => current.filter((item) => String(item.id) !== String(id)));
    },
    [setFavorites],
  );

  const clearHistory = useCallback(() => setSearchHistory([]), [setSearchHistory]);

  const isFavorite = useCallback(
    (id) => favorites.some((item) => String(item.id) === String(id)),
    [favorites],
  );

  const value = useMemo(
    () => ({
      selectedLocation,
      favorites,
      searchHistory,
      selectLocation,
      addFavorite,
      removeFavorite,
      clearHistory,
      isFavorite,
    }),
    [
      selectedLocation,
      favorites,
      searchHistory,
      selectLocation,
      addFavorite,
      removeFavorite,
      clearHistory,
      isFavorite,
    ],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}
