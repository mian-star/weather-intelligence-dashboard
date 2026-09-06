/**
 * Preference option values plus the LocalStorage keys used to persist them.
 * All keys are namespaced with `wid:` (Weather Intelligence Dashboard).
 */

export const TEMPERATURE_UNITS = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
};

export const WIND_UNITS = {
  KMH: 'kmh',
  MPH: 'mph',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const FORECAST_DISPLAYS = {
  DETAILED: 'detailed',
  COMPACT: 'compact',
};

export const STORAGE_KEYS = {
  FAVORITES: 'wid:favorites',
  SEARCH_HISTORY: 'wid:searchHistory',
  TEMPERATURE_UNIT: 'wid:temperatureUnit',
  WIND_UNIT: 'wid:windUnit',
  THEME: 'wid:theme',
  FORECAST_DISPLAY: 'wid:forecastDisplay',
  LAST_LOCATION: 'wid:lastLocation',
  REMEMBER_LAST_LOCATION: 'wid:rememberLastLocation',
};

export const SEARCH_HISTORY_LIMIT = 5;
export const MAX_SEARCH_TERM_LENGTH = 100;
