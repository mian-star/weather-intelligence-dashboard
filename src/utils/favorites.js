import { FAVORITE_SORTS } from '../constants/favorites';

/**
 * Pure sort helper for the favorites list. Never mutates its input — it
 * sorts a copy — so `favorites` in LocationContext stays in the order
 * locations were actually saved (oldest first), which "Recently added"
 * relies on.
 */

const SORT_COMPARATORS = {
  [FAVORITE_SORTS.NAME_ASC]: (a, b) => a.name.localeCompare(b.name),
  [FAVORITE_SORTS.COUNTRY_ASC]: (a, b) =>
    (a.country ?? '').localeCompare(b.country ?? '') || a.name.localeCompare(b.name),
};

export function sortFavorites(favorites, sortKey) {
  if (!Array.isArray(favorites)) return [];
  if (sortKey === FAVORITE_SORTS.RECENT) return [...favorites].reverse();
  const comparator = SORT_COMPARATORS[sortKey];
  if (!comparator) return [...favorites];
  return [...favorites].sort(comparator);
}
