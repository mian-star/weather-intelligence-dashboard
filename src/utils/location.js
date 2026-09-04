/**
 * Reduces any location-shaped object (a geocoding result, a stored favorite, a
 * URL param, geolocation coords) down to the small set of fields the app needs
 * to reload the weather without another search.
 */
export function toStoredLocation(location) {
  if (!location) return null;
  return {
    id: location.id ?? `${location.latitude},${location.longitude}`,
    name: location.name ?? 'Selected location',
    country: location.country ?? null,
    countryCode: location.countryCode ?? null,
    admin1: location.admin1 ?? null,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone ?? null,
  };
}

export function sameLocation(a, b) {
  if (!a || !b) return false;
  return String(a.id) === String(b.id);
}
