import { useCallback, useState } from 'react';

/**
 * Wraps the browser Geolocation API in a promise-friendly hook.
 *
 * Location detection is never automatic and never required — the user has to
 * press a button, and a denial just leaves the app in its normal state with a
 * message.
 */

export const GEO_STATUS = {
  IDLE: 'idle',
  UNSUPPORTED: 'unsupported',
  LOADING: 'loading',
  GRANTED: 'granted',
  DENIED: 'denied',
};

export function useGeolocation() {
  const supported =
    typeof navigator !== 'undefined' && 'geolocation' in navigator;

  const [status, setStatus] = useState(
    supported ? GEO_STATUS.IDLE : GEO_STATUS.UNSUPPORTED,
  );
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!supported) {
      setStatus(GEO_STATUS.UNSUPPORTED);
      return Promise.resolve(null);
    }

    setStatus(GEO_STATUS.LOADING);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoords(next);
          setStatus(GEO_STATUS.GRANTED);
          resolve(next);
        },
        (geoError) => {
          setStatus(GEO_STATUS.DENIED);
          setError(
            geoError.code === geoError.PERMISSION_DENIED
              ? 'Location permission was denied. You can still search for a city.'
              : 'We could not determine your location. Try searching instead.',
          );
          resolve(null);
        },
        { timeout: 10000, maximumAge: 5 * 60 * 1000 },
      );
    });
  }, [supported]);

  return { status, coords, error, requestLocation, supported };
}
