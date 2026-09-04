/**
 * Low-level HTTP client for the Open-Meteo APIs.
 *
 * Responsibilities:
 *  - build the query string
 *  - run fetch with an optional AbortSignal
 *  - translate every failure mode into one of our typed errors so the UI can
 *    show a friendly message instead of a raw exception
 */

export class ApiError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status ?? null;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Could not reach the weather service. Check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class InvalidResponseError extends Error {
  constructor(message = 'The weather service returned an unexpected response.') {
    super(message);
    this.name = 'InvalidResponseError';
  }
}

/** An aborted request is expected (user searched again) — callers ignore it. */
export function isAbortError(error) {
  return error?.name === 'AbortError';
}

function buildUrl(baseUrl, params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    search.set(key, Array.isArray(value) ? value.join(',') : String(value));
  });
  return `${baseUrl}?${search.toString()}`;
}

export async function requestJSON(baseUrl, params, { signal } = {}) {
  let response;
  try {
    response = await fetch(buildUrl(baseUrl, params), { signal });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new NetworkError();
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new InvalidResponseError();
  }

  // Open-Meteo signals problems with `{ error: true, reason: '...' }`.
  if (!response.ok || body?.error === true) {
    const reason = body?.reason || `Request failed with status ${response.status}`;
    throw new ApiError(reason, { status: response.status });
  }

  return body;
}
