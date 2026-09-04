import { useCallback, useEffect, useState } from 'react';
import { fetchForecast } from '../services/forecastService';
import { isAbortError } from '../services/openMeteoClient';
import { transformForecastResponse } from '../utils/transform';
import { parseCoordinate } from '../utils/validation';

/**
 * Loads (and reloads) the forecast for a location.
 *
 * The effect synchronises with an external system (the Open-Meteo HTTP API),
 * keyed to the location's coordinates plus a reload counter. Whenever that key
 * changes it aborts any in-flight request and starts a fresh one, so a slow
 * response for an old city can never overwrite a newer one.
 *
 * `isLoading` / `weather` / `error` are *derived*: a stored result only counts
 * once its `key` matches the key we're currently asking for. That keeps all the
 * setState calls inside async callbacks instead of the effect body.
 */
export function useWeather(location) {
  const [result, setResult] = useState({ key: null, weather: null, error: null });
  const [reloadToken, setReloadToken] = useState(0);

  const latitude = parseCoordinate(location?.latitude);
  const longitude = parseCoordinate(location?.longitude);
  const requestKey =
    latitude !== null && longitude !== null
      ? `${latitude},${longitude},${reloadToken}`
      : null;

  useEffect(() => {
    if (!requestKey) return undefined;

    const controller = new AbortController();

    fetchForecast({ latitude, longitude, signal: controller.signal })
      .then((raw) => {
        setResult({ key: requestKey, weather: transformForecastResponse(raw), error: null });
      })
      .catch((err) => {
        if (isAbortError(err)) return; // superseded by a newer request
        setResult({ key: requestKey, weather: null, error: err });
      });

    return () => controller.abort();
  }, [requestKey, latitude, longitude]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  const matches = result.key === requestKey;
  return {
    weather: matches ? result.weather : null,
    error: matches ? result.error : null,
    isLoading: Boolean(requestKey) && !matches,
    refetch,
  };
}
