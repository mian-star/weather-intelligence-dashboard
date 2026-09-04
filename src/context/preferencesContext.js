import { createContext, useContext } from 'react';

/**
 * Context object + consumer hook for user display preferences
 * (temperature unit, wind unit, theme, forecast display style).
 *
 * The provider component lives in PreferencesProvider.jsx.
 */
export const PreferencesContext = createContext(null);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
