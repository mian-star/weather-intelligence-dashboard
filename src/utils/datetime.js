/**
 * Date / time formatting helpers.
 *
 * Open-Meteo is queried with `timezone=auto`, so every timestamp it returns is
 * already the local wall-clock time at the requested location, written as a
 * "naive" ISO string with no offset (e.g. "2026-09-01T08:00").
 *
 * To display those digits exactly as given — without the browser re-shifting
 * them into its own timezone — we parse them as if they were UTC and format
 * with `timeZone: 'UTC'`. Day and month names still come from Intl, never
 * hardcoded.
 */

function parseAsUtc(value) {
  if (value instanceof Date) return value;
  if (typeof value !== 'string') return null;

  let iso = value;
  if (iso.includes('T') && !/[zZ]|[+-]\d\d:?\d\d$/.test(iso)) {
    iso = `${iso}Z`; // naive local-to-location time -> pin to UTC
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

const UTC = 'UTC';

function format(value, options) {
  const date = parseAsUtc(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat(undefined, { ...options, timeZone: UTC }).format(date);
}

export const formatDayName = (value) => format(value, { weekday: 'long' });

export const formatShortDate = (value) =>
  format(value, { weekday: 'long', month: 'long', day: 'numeric' });

export const formatCompactDate = (value) =>
  format(value, { month: 'short', day: 'numeric' });

export const formatTime = (value) => format(value, { hour: '2-digit', minute: '2-digit' });

export const formatUpdatedAt = (value) =>
  format(value, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
