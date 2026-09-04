import { GEOCODING_BASE_URL, GEOCODING_RESULT_COUNT } from '../constants/api';
import { InvalidResponseError, requestJSON } from './openMeteoClient';

/**
 * Location search via the Open-Meteo geocoding API.
 * Returns a normalised array so the rest of the app never sees the raw payload.
 */

function normaliseResult(item) {
  return {
    id: item.id,
    name: item.name,
    country: item.country ?? null,
    countryCode: item.country_code ?? null,
    admin1: item.admin1 ?? null,
    admin2: item.admin2 ?? null,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone ?? null,
    population: item.population ?? null,
  };
}

export async function searchLocations(term, { signal } = {}) {
  const body = await requestJSON(
    GEOCODING_BASE_URL,
    { name: term, count: GEOCODING_RESULT_COUNT, language: 'en', format: 'json' },
    { signal },
  );

  // A search with no matches comes back as `{}` (no `results` key) — that's
  // valid, it just means "empty".
  if (body.results === undefined) return [];
  if (!Array.isArray(body.results)) throw new InvalidResponseError();

  return body.results
    .filter((item) => item && item.name && item.latitude != null && item.longitude != null)
    .map(normaliseResult);
}
