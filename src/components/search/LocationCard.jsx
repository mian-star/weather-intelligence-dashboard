import { ChevronRight, MapPin } from 'lucide-react';

/**
 * One geocoding result row inside the search dropdown. Presentational: it
 * renders the location and calls `onSelect(location)` when clicked. The parent
 * decides what selecting means.
 */
export function LocationCard({ location, onSelect }) {
  const region = [location.admin1, location.country].filter(Boolean).join(', ');

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(location)}
        className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-raised"
      >
        <MapPin className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-content">{location.name}</span>
          {region ? <span className="block truncate text-xs text-muted">{region}</span> : null}
          <span className="block text-[0.7rem] text-subtle">
            {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
          </span>
        </span>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
          aria-hidden="true"
        />
      </button>
    </li>
  );
}
