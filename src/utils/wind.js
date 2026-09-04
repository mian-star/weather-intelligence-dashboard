import { WIND_UNITS } from '../constants/preferences';

/** Wind speed is stored in km/h (API source unit) and converted on display. */

const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

export function degreesToCompass(degrees) {
  if (degrees === null || degrees === undefined || Number.isNaN(degrees)) {
    return '—';
  }
  const index = Math.round(degrees / 22.5) % 16;
  return COMPASS_POINTS[index];
}

export function convertWindSpeed(kmh, unit = WIND_UNITS.KMH) {
  if (kmh === null || kmh === undefined || Number.isNaN(kmh)) return null;
  if (unit === WIND_UNITS.MPH) return kmh / 1.609344;
  return kmh;
}

export function windUnitLabel(unit = WIND_UNITS.KMH) {
  return unit === WIND_UNITS.MPH ? 'mph' : 'km/h';
}

export function formatWindSpeed(kmh, unit = WIND_UNITS.KMH) {
  const converted = convertWindSpeed(kmh, unit);
  if (converted === null) return '—';
  return `${Math.round(converted)} ${windUnitLabel(unit)}`;
}
