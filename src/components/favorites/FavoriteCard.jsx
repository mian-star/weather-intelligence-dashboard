import { ChevronRight, MapPin, Trash2 } from 'lucide-react';

/**
 * One saved location. Receives the favorite plus `onSelect` / `onRemove`
 * callbacks and whether it is the currently active location.
 */
export function FavoriteCard({ favorite, isActive, onSelect, onRemove }) {
  const region = [favorite.admin1, favorite.country].filter(Boolean).join(', ');

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl border bg-surface p-4 transition-colors ${
        isActive ? 'border-brand bg-brand-soft' : 'border-subtle-border hover:border-brand/50'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(favorite)}
        className="group flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-content">
            {favorite.name}
            {isActive ? (
              <span className="ml-2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-contrast">
                Active
              </span>
            ) : null}
          </span>
          {region ? <span className="block text-sm text-muted">{region}</span> : null}
        </span>
        <ChevronRight
          className="ml-auto h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        onClick={() => onRemove(favorite.id)}
        aria-label={`Remove ${favorite.name} from favorites`}
        className="shrink-0 rounded-lg p-2 text-subtle transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}
