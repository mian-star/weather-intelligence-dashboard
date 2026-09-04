import { createContext, useContext } from 'react';

/**
 * Context object + consumer hook for the active location and the user's
 * location collections (favorites and search history).
 *
 * The provider component lives in LocationProvider.jsx.
 */
export const LocationContext = createContext(null);

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
