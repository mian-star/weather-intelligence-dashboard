import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from '../../context/locationContext';

/** Header shortcut to the Favorites page with a live count badge. */
export function FavoritesIndicator() {
  const { favorites } = useLocation();

  return (
    <Link
      to="/favorites"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-border bg-surface text-muted transition-colors hover:border-brand/60 hover:text-content"
      aria-label={`Favorites (${favorites.length} saved)`}
    >
      <Star className="h-4.5 w-4.5" aria-hidden="true" />
      {favorites.length > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {favorites.length}
        </span>
      ) : null}
    </Link>
  );
}
