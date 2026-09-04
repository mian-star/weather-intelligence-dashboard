import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../context/locationContext';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { SectionHeading } from '../common/SectionHeading';
import { FavoriteCard } from './FavoriteCard';

/**
 * Favorites list. Reads everything from LocationContext. Selecting a favorite
 * makes it the active location and sends the user to the dashboard.
 */
export function Favorites() {
  const { favorites, selectedLocation, selectLocation, removeFavorite } = useLocation();
  const navigate = useNavigate();

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
      />
      {favorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorite locations yet"
          hint="Search for a city on the dashboard and use “Save location” to add it here."
        />
      ) : (
        <ul className="space-y-2">
          {favorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              isActive={String(selectedLocation?.id) === String(favorite.id)}
              onSelect={handleSelect}
              onRemove={removeFavorite}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
