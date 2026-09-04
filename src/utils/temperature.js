import { TEMPERATURE_UNITS } from '../constants/preferences';

/**
 * All temperatures in the app are stored in Celsius (the API source unit).
 * The display unit is derived here so we never keep two copies in state.
 */

export function convertTemperature(celsius, unit = TEMPERATURE_UNITS.CELSIUS) {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) {
    return null;
  }
  if (unit === TEMPERATURE_UNITS.FAHRENHEIT) {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

export function unitSymbol(unit = TEMPERATURE_UNITS.CELSIUS) {
  return unit === TEMPERATURE_UNITS.FAHRENHEIT ? '°F' : '°C';
}

export function formatTemperature(celsius, unit = TEMPERATURE_UNITS.CELSIUS) {
  const converted = convertTemperature(celsius, unit);
  if (converted === null) return '—';
  return `${Math.round(converted)}${unitSymbol(unit)}`;
}
