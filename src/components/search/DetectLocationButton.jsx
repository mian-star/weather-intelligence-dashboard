import { LocateFixed } from 'lucide-react';
import { GEO_STATUS, useGeolocation } from '../../hooks/useGeolocation';

/**
 * Optional "use my location" control. Never runs automatically — the user must
 * press it. On success it hands coordinates to `onLocated`; on denial it just
 * shows a message and the rest of the app is unaffected.
 */
export function DetectLocationButton({ onLocated }) {
  const { status, error, requestLocation, supported } = useGeolocation();

  if (!supported) return null;

  const handleClick = async () => {
    const coords = await requestLocation();
    if (coords) onLocated(coords);
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === GEO_STATUS.LOADING}
        className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft disabled:opacity-50"
      >
        <LocateFixed
          className={`h-4 w-4 ${status === GEO_STATUS.LOADING ? 'animate-pulse' : ''}`}
          aria-hidden="true"
        />
        {status === GEO_STATUS.LOADING ? 'Detecting…' : 'Use my current location'}
      </button>
      {error ? <p className="mt-1 text-sm text-muted">{error}</p> : null}
    </div>
  );
}
