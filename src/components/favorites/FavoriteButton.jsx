import { Star } from 'lucide-react';
import { useLocation } from '../../context/locationContext';

/**
 * Toggles the given location in the favorites list.
 * Adding is a no-op when the location is already saved (duplicate prevention
 * lives in LocationProvider). Disabled when there is no location.
 */
export function FavoriteButton({ location }) {
  const { isFavorite, addFavorite, removeFavorite } = useLocation();
  const id = location?.id;
  const saved = id ? isFavorite(id) : false;

  const handleClick = () => {
    if (!location) return;
    if (saved) {
      removeFavorite(id);
    } else {
      addFavorite(location);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!location}
      aria-pressed={saved}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-colors active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${
        saved
          ? 'border-accent/50 bg-accent/10 text-accent'
          : 'border-subtle-border bg-surface/70 text-muted hover:border-accent/40 hover:text-content'
      }`}
    >
      <Star
        className="h-4 w-4"
        aria-hidden="true"
        fill={saved ? 'currentColor' : 'none'}
      />
      {saved ? 'Saved' : 'Save location'}
    </button>
  );
}
