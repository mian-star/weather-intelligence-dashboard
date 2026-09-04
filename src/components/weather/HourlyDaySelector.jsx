import { formatCompactDate, formatDayName } from '../../utils/datetime';

/**
 * Day picker for the hourly section.
 *
 * Open-Meteo's forecast window starts at "today" for the location, so the first
 * two entries are simply Today / Tomorrow; the rest show their weekday name
 * (from Intl — never hardcoded).
 */
export function HourlyDaySelector({ days, selectedIndex, onSelect }) {
  const labelFor = (dateKey, index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return formatDayName(dateKey);
  };

  return (
    <div
      role="tablist"
      aria-label="Forecast day"
      className="mb-4 flex gap-2 overflow-x-auto pb-1"
    >
      {days.map((day, index) => {
        const active = index === selectedIndex;
        return (
          <button
            key={day.dateKey}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(index)}
            className={`shrink-0 rounded-xl border px-3 py-1.5 text-left text-sm font-semibold transition-colors ${
              active
                ? 'border-brand bg-brand text-brand-contrast'
                : 'border-subtle-border text-muted hover:border-brand/60 hover:text-content'
            }`}
          >
            <span className="block">{labelFor(day.dateKey, index)}</span>
            <span
              className={`block text-xs font-medium ${
                active ? 'text-brand-contrast/80' : 'text-subtle'
              }`}
            >
              {formatCompactDate(day.dateKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
