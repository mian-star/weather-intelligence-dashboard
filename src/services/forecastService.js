import {
  CURRENT_FIELDS,
  DAILY_FIELDS,
  FORECAST_BASE_URL,
  FORECAST_DAYS,
  HOURLY_FIELDS,
} from '../constants/api';
import { InvalidResponseError, requestJSON } from './openMeteoClient';

/**
 * Weather forecast via the Open-Meteo forecast API.
 *
 * We always ask for metric units (Celsius, km/h, mm) and a 7-day window. The
 * caller passes latitude / longitude; unit conversion happens in the UI layer.
 */

export async function fetchForecast({ latitude, longitude, signal } = {}) {
  const body = await requestJSON(
    FORECAST_BASE_URL,
    {
      latitude,
      longitude,
      current: CURRENT_FIELDS,
      hourly: HOURLY_FIELDS,
      daily: DAILY_FIELDS,
      timezone: 'auto',
      forecast_days: FORECAST_DAYS,
      wind_speed_unit: 'kmh',
      temperature_unit: 'celsius',
      precipitation_unit: 'mm',
    },
    { signal },
  );

  if (!body || (!body.current && !body.daily && !body.hourly)) {
    throw new InvalidResponseError();
  }

  return body;
}
