import { MAX_SEARCH_TERM_LENGTH } from '../constants/preferences';

/**
 * Guards used before we trust API data or user input.
 * The UI stays usable when optional fields are missing — these helpers let the
 * components decide what to render.
 */

export function normaliseSearchTerm(raw) {
  return typeof raw === 'string' ? raw.trim() : '';
}

export function isValidSearchTerm(raw) {
  const term = normaliseSearchTerm(raw);
  return term.length > 0 && term.length <= MAX_SEARCH_TERM_LENGTH;
}

export function parseCoordinate(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function hasValidCoordinates(location) {
  if (!location) return false;
  const lat = parseCoordinate(location.latitude);
  const lon = parseCoordinate(location.longitude);
  return (
    lat !== null && lon !== null && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
  );
}

export function hasCurrentWeather(weather) {
  return Boolean(weather && weather.current);
}

export function hasDailyForecast(weather) {
  return Boolean(weather && Array.isArray(weather.daily) && weather.daily.length > 0);
}

export function hasHourlyForecast(weather) {
  return Boolean(weather && Array.isArray(weather.hourly) && weather.hourly.length > 0);
}
