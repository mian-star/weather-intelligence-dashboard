import { useCallback, useEffect, useMemo } from 'react';
import {
  STORAGE_KEYS,
  THEMES,
  TEMPERATURE_UNITS,
  WIND_UNITS,
  FORECAST_DISPLAYS,
} from '../constants/preferences';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PreferencesContext } from './preferencesContext';

function systemPrefersDark() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );
}

/**
 * Owns every app-wide display preference. Each value is persisted to
 * LocalStorage via useLocalStorage, so a browser refresh restores them.
 * A single effect keeps <html class="dark"> in sync with the theme value.
 */
export function PreferencesProvider({ children }) {
  const [temperatureUnit, setTemperatureUnit] = useLocalStorage(
    STORAGE_KEYS.TEMPERATURE_UNIT,
    TEMPERATURE_UNITS.CELSIUS,
  );
  const [windUnit, setWindUnit] = useLocalStorage(
    STORAGE_KEYS.WIND_UNIT,
    WIND_UNITS.KMH,
  );
  const [theme, setTheme] = useLocalStorage(
    STORAGE_KEYS.THEME,
    systemPrefersDark() ? THEMES.DARK : THEMES.LIGHT,
  );
  const [forecastDisplay, setForecastDisplay] = useLocalStorage(
    STORAGE_KEYS.FORECAST_DISPLAY,
    FORECAST_DISPLAYS.DETAILED,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === THEMES.DARK);
    root.dataset.theme = theme;
  }, [theme]);

  const toggleTemperatureUnit = useCallback(() => {
    setTemperatureUnit((current) =>
      current === TEMPERATURE_UNITS.CELSIUS
        ? TEMPERATURE_UNITS.FAHRENHEIT
        : TEMPERATURE_UNITS.CELSIUS,
    );
  }, [setTemperatureUnit]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  }, [setTheme]);

  const value = useMemo(
    () => ({
      temperatureUnit,
      windUnit,
      theme,
      forecastDisplay,
      setTemperatureUnit,
      setWindUnit,
      setTheme,
      setForecastDisplay,
      toggleTemperatureUnit,
      toggleTheme,
    }),
    [
      temperatureUnit,
      windUnit,
      theme,
      forecastDisplay,
      setTemperatureUnit,
      setWindUnit,
      setTheme,
      setForecastDisplay,
      toggleTemperatureUnit,
      toggleTheme,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}
