/**
 * Open-Meteo endpoints and the request field lists.
 * Keeping these here means no UI component needs to know how a URL is built.
 */

export const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const GEOCODING_RESULT_COUNT = 8;
export const FORECAST_DAYS = 7;

// The API always answers in metric. The app converts to the user's unit at render time.
export const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'cloud_cover',
  'pressure_msl',
  'is_day',
];

export const HOURLY_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'precipitation',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
];

export const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'sunrise',
  'sunset',
  'uv_index_max',
];
