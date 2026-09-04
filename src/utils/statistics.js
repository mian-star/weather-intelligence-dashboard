import { RAINY_DAY_MIN_MM } from '../constants/forecast';
import { isRainyCode } from './weatherCodes';

/**
 * Weather statistics derived from the 7-day forecast.
 * Everything here is calculated from the data — nothing is hardcoded.
 * Temperatures stay in Celsius; the UI converts them for display.
 */

const EMPTY_STATS = {
  highestTemp: null,
  lowestTemp: null,
  averageTemp: null,
  totalPrecipitation: 0,
  maxWindSpeed: null,
  rainyDayCount: 0,
  dayCount: 0,
};

export function calculateStatistics(days) {
  if (!Array.isArray(days) || days.length === 0) return EMPTY_STATS;

  const maxTemps = days.map((day) => day.tempMax).filter((value) => value !== null);
  const minTemps = days.map((day) => day.tempMin).filter((value) => value !== null);
  const windSpeeds = days.map((day) => day.windSpeedMax).filter((value) => value !== null);

  const totalPrecipitation = days.reduce(
    (sum, day) => sum + (day.precipitation ?? 0),
    0,
  );

  const averageSource = days
    .map((day) => day.tempAverage)
    .filter((value) => value !== null);
  const averageTemp =
    averageSource.length > 0
      ? averageSource.reduce((sum, value) => sum + value, 0) / averageSource.length
      : null;

  const rainyDayCount = days.filter(
    (day) => isRainyCode(day.weatherCode) || (day.precipitation ?? 0) >= RAINY_DAY_MIN_MM,
  ).length;

  return {
    highestTemp: maxTemps.length ? Math.max(...maxTemps) : null,
    lowestTemp: minTemps.length ? Math.min(...minTemps) : null,
    averageTemp,
    totalPrecipitation: Math.round(totalPrecipitation * 10) / 10,
    maxWindSpeed: windSpeeds.length ? Math.max(...windSpeeds) : null,
    rainyDayCount,
    dayCount: days.length,
  };
}
