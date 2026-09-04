/**
 * Single source of truth for WMO weather codes.
 *
 * `group` collapses the ~28 codes into a handful of buckets the UI cares about
 * (used for icons and for the "rainy day" filter). `label` is the human string.
 * Keeping this in one map means no big switch statements scattered around.
 */

export const WEATHER_GROUPS = {
  CLEAR: 'clear',
  CLOUDY: 'cloudy',
  FOG: 'fog',
  DRIZZLE: 'drizzle',
  RAIN: 'rain',
  SNOW: 'snow',
  SHOWERS: 'showers',
  THUNDERSTORM: 'thunderstorm',
  UNKNOWN: 'unknown',
};

const WET_GROUPS = new Set([
  WEATHER_GROUPS.DRIZZLE,
  WEATHER_GROUPS.RAIN,
  WEATHER_GROUPS.SHOWERS,
  WEATHER_GROUPS.THUNDERSTORM,
]);

export const WEATHER_CODES = {
  0: { label: 'Clear sky', group: WEATHER_GROUPS.CLEAR },
  1: { label: 'Mainly clear', group: WEATHER_GROUPS.CLEAR },
  2: { label: 'Partly cloudy', group: WEATHER_GROUPS.CLOUDY },
  3: { label: 'Overcast', group: WEATHER_GROUPS.CLOUDY },
  45: { label: 'Fog', group: WEATHER_GROUPS.FOG },
  48: { label: 'Depositing rime fog', group: WEATHER_GROUPS.FOG },
  51: { label: 'Light drizzle', group: WEATHER_GROUPS.DRIZZLE },
  53: { label: 'Moderate drizzle', group: WEATHER_GROUPS.DRIZZLE },
  55: { label: 'Dense drizzle', group: WEATHER_GROUPS.DRIZZLE },
  56: { label: 'Light freezing drizzle', group: WEATHER_GROUPS.DRIZZLE },
  57: { label: 'Dense freezing drizzle', group: WEATHER_GROUPS.DRIZZLE },
  61: { label: 'Slight rain', group: WEATHER_GROUPS.RAIN },
  63: { label: 'Moderate rain', group: WEATHER_GROUPS.RAIN },
  65: { label: 'Heavy rain', group: WEATHER_GROUPS.RAIN },
  66: { label: 'Light freezing rain', group: WEATHER_GROUPS.RAIN },
  67: { label: 'Heavy freezing rain', group: WEATHER_GROUPS.RAIN },
  71: { label: 'Slight snowfall', group: WEATHER_GROUPS.SNOW },
  73: { label: 'Moderate snowfall', group: WEATHER_GROUPS.SNOW },
  75: { label: 'Heavy snowfall', group: WEATHER_GROUPS.SNOW },
  77: { label: 'Snow grains', group: WEATHER_GROUPS.SNOW },
  80: { label: 'Slight rain showers', group: WEATHER_GROUPS.SHOWERS },
  81: { label: 'Moderate rain showers', group: WEATHER_GROUPS.SHOWERS },
  82: { label: 'Violent rain showers', group: WEATHER_GROUPS.SHOWERS },
  85: { label: 'Slight snow showers', group: WEATHER_GROUPS.SNOW },
  86: { label: 'Heavy snow showers', group: WEATHER_GROUPS.SNOW },
  95: { label: 'Thunderstorm', group: WEATHER_GROUPS.THUNDERSTORM },
  96: { label: 'Thunderstorm with slight hail', group: WEATHER_GROUPS.THUNDERSTORM },
  99: { label: 'Thunderstorm with heavy hail', group: WEATHER_GROUPS.THUNDERSTORM },
};

const UNKNOWN_ENTRY = { label: 'Unknown', group: WEATHER_GROUPS.UNKNOWN };

export function getWeatherEntry(code) {
  return WEATHER_CODES[code] ?? UNKNOWN_ENTRY;
}

export function getWeatherDescription(code) {
  return getWeatherEntry(code).label;
}

export function getWeatherGroup(code) {
  return getWeatherEntry(code).group;
}

export function isRainyCode(code) {
  return WET_GROUPS.has(getWeatherGroup(code));
}
