/**
 * Options for the favorites sort control.
 * `value` is what lives in component state; `label` is what the user sees.
 */

export const FAVORITE_SORTS = {
  RECENT: 'recent',
  NAME_ASC: 'nameAsc',
  COUNTRY_ASC: 'countryAsc',
};

export const FAVORITE_SORT_OPTIONS = [
  { value: FAVORITE_SORTS.RECENT, label: 'Recently added' },
  { value: FAVORITE_SORTS.NAME_ASC, label: 'Name (A–Z)' },
  { value: FAVORITE_SORTS.COUNTRY_ASC, label: 'Country (A–Z)' },
];
