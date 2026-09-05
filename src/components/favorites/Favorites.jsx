import { useMemo, useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FAVORITE_SORTS, FAVORITE_SORT_OPTIONS } from '../../constants/favorites';
import { useLocation } from '../../context/locationContext';
import { sortFavorites } from '../../utils/favorites';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { SectionHeading } from '../common/SectionHeading';
import { Select } from '../common/Select';
import { FavoriteCard } from './FavoriteCard';

/**
 * Favorites list. Reads everything from LocationContext. Selecting a favorite
 * makes it the active location and sends the user to the dashboard.
 *
 * Sorting is local UI state — the list rendered is *derived* from `favorites`
 * + `sort` via useMemo, the same pattern `Forecast` uses for its own sort
 * control, so it can never drift out of sync with the saved data.
 */
export function Favorites() {
  const { favorites, selectedLocation, selectLocation, removeFavorite } = useLocation();
  const navigate = useNavigate();
  const [sort, setSort] = useState(FAVORITE_SORTS.RECENT);

  const sortedFavorites = useMemo(() => sortFavorites(favorites, sort), [favorites, sort]);

  const handleSelect = (favorite) => {
    selectLocation(favorite);
    navigate('/weather');
  };

  return (
    <Card as="section" aria-label="Favorite locations">
      <SectionHeading
        title="Favorite locations"
        icon={Star}
        description={`${favorites.length} saved`}
        actions={
          favorites.length > 0 ? (
            <Select
              id="favorites-sort"
              label="Sort by"
              value={sort}
              onChange={setSort}
              options={FAVORITE_SORT_OPTIONS}
              className="w-40"
            />
          ) : null
        }
      />
      {favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorite locations yet"
          hint="Search for a city on the dashboard and use “Save location” to add it here."
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {sortedFavorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              isActive={String(selectedLocation?.id) === String(favorite.id)}
              onSelect={handleSelect}
              onRemove={removeFavorite}
            />
          ))}
          <li>
            <Link
              to="/weather"
              className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-subtle-border p-4 text-center transition-colors hover:border-brand/50 hover:bg-brand-soft/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-raised text-subtle">
                <Plus className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-content">Add new location</span>
              <span className="text-xs text-muted">Search any city on the dashboard.</span>
            </Link>
          </li>
        </ul>
      )}
    </Card>
  );
}
