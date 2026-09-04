import {
  FORECAST_FILTERS,
  FORECAST_SORTS,
  RAINY_DAY_MIN_MM,
  STRONG_WIND_THRESHOLD_KMH,
} from '../constants/forecast';
import { isRainyCode } from './weatherCodes';

/**
 * Pure filter / sort helpers for the forecast list.
 * `sortForecastDays` never mutates its input — it sorts a copy — so the
 * forecast data in state stays in its original order.
 */

export function applyForecastFilter(days, filter, hotThresholdCelsius) {
  if (!Array.isArray(days)) return [];

  switch (filter) {
    case FORECAST_FILTERS.RAIN:
      return days.filter((day) => isRainyCode(day.weatherCode));
    case FORECAST_FILTERS.PRECIPITATION:
      return days.filter((day) => (day.precipitation ?? 0) >= RAINY_DAY_MIN_MM);
    case FORECAST_FILTERS.HOT:
      return days.filter(
        (day) => day.tempMax !== null && day.tempMax > hotThresholdCelsius,
      );
    case FORECAST_FILTERS.STRONG_WIND:
      return days.filter(
        (day) => (day.windSpeedMax ?? 0) >= STRONG_WIND_THRESHOLD_KMH,
      );
    case FORECAST_FILTERS.ALL:
    default:
      return days;
  }
}

const SORT_COMPARATORS = {
  [FORECAST_SORTS.TEMP_DESC]: (a, b) => (b.tempMax ?? -Infinity) - (a.tempMax ?? -Infinity),
  [FORECAST_SORTS.TEMP_ASC]: (a, b) => (a.tempMin ?? Infinity) - (b.tempMin ?? Infinity),
  [FORECAST_SORTS.WIND_DESC]: (a, b) => (b.windSpeedMax ?? -Infinity) - (a.windSpeedMax ?? -Infinity),
  [FORECAST_SORTS.PRECIP_DESC]: (a, b) => (b.precipitation ?? -Infinity) - (a.precipitation ?? -Infinity),
};

export function sortForecastDays(days, sortKey) {
  if (!Array.isArray(days)) return [];
  const comparator = SORT_COMPARATORS[sortKey];
  if (!comparator) return [...days];
  return [...days].sort(comparator);
}
