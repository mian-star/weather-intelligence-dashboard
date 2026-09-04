/**
 * Options for the forecast filter and sort controls.
 * `value` is what lives in component state; `label` is what the user sees.
 */

export const FORECAST_FILTERS = {
  ALL: 'all',
  RAIN: 'rain',
  PRECIPITATION: 'precipitation',
  HOT: 'hot',
  STRONG_WIND: 'strongWind',
};

export const FORECAST_FILTER_OPTIONS = [
  { value: FORECAST_FILTERS.ALL, label: 'All days' },
  { value: FORECAST_FILTERS.RAIN, label: 'Rainy days' },
  { value: FORECAST_FILTERS.PRECIPITATION, label: 'Any precipitation' },
  { value: FORECAST_FILTERS.HOT, label: 'Hot days (max temp above…)' },
  { value: FORECAST_FILTERS.STRONG_WIND, label: 'Strong wind' },
];

// Threshold used by the HOT filter, expressed in Celsius (the source unit).
export const DEFAULT_HOT_THRESHOLD_C = 30;

// Wind above this (km/h) counts as "strong" for the STRONG_WIND filter.
export const STRONG_WIND_THRESHOLD_KMH = 40;

// A day with at least this much precipitation (mm) counts as a rainy day.
export const RAINY_DAY_MIN_MM = 1;

export const FORECAST_SORTS = {
  DEFAULT: 'default',
  TEMP_DESC: 'tempDesc',
  TEMP_ASC: 'tempAsc',
  WIND_DESC: 'windDesc',
  PRECIP_DESC: 'precipDesc',
};

export const FORECAST_SORT_OPTIONS = [
  { value: FORECAST_SORTS.DEFAULT, label: 'Date (default)' },
  { value: FORECAST_SORTS.TEMP_DESC, label: 'Highest temperature' },
  { value: FORECAST_SORTS.TEMP_ASC, label: 'Lowest temperature' },
  { value: FORECAST_SORTS.WIND_DESC, label: 'Highest wind speed' },
  { value: FORECAST_SORTS.PRECIP_DESC, label: 'Highest precipitation' },
];

export const CHART_METRICS = {
  TEMPERATURE: 'temperature',
  PRECIPITATION: 'precipitation',
  WIND: 'wind',
};

export const CHART_METRIC_OPTIONS = [
  { value: CHART_METRICS.TEMPERATURE, label: 'Temperature' },
  { value: CHART_METRICS.PRECIPITATION, label: 'Precipitation' },
  { value: CHART_METRICS.WIND, label: 'Wind speed' },
];
