import {
  FORECAST_FILTERS,
  FORECAST_FILTER_OPTIONS,
  FORECAST_SORT_OPTIONS,
} from '../../constants/forecast';
import { Select } from '../common/Select';

// Short chip labels — the constant labels are written for a <select>.
const CHIP_LABELS = {
  [FORECAST_FILTERS.ALL]: 'All',
  [FORECAST_FILTERS.RAIN]: 'Rainy',
  [FORECAST_FILTERS.PRECIPITATION]: 'Precip',
  [FORECAST_FILTERS.HOT]: 'High temp',
  [FORECAST_FILTERS.STRONG_WIND]: 'Windy',
};

/**
 * Controlled filter + sort controls for the forecast. All state lives in the
 * parent <Forecast>; this component only reports changes through callbacks.
 * The filter is a segmented chip row; sort is a dropdown. The "hot days"
 * threshold is kept in Celsius (the source unit).
 */
export function ForecastControls({
  filter,
  onFilterChange,
  hotThreshold,
  onHotThresholdChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filter forecast" className="flex flex-wrap gap-1.5">
          {FORECAST_FILTER_OPTIONS.map((option) => {
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onFilterChange(option.value)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-brand bg-brand text-brand-contrast'
                    : 'border-subtle-border text-muted hover:border-brand/50 hover:text-content'
                }`}
              >
                {CHIP_LABELS[option.value] ?? option.label}
              </button>
            );
          })}
        </div>

        {filter === FORECAST_FILTERS.HOT ? (
          <label className="flex items-center gap-1.5 text-xs font-medium text-subtle">
            Above
            <input
              type="number"
              value={hotThreshold}
              onChange={(event) => onHotThresholdChange(event.target.value)}
              aria-label="Max temp threshold in Celsius"
              className="w-16 rounded-lg border border-subtle-border bg-surface px-2 py-1 text-sm font-medium text-content"
            />
            °C
          </label>
        ) : null}
      </div>

      <Select
        id="forecast-sort"
        label="Sort by"
        hideLabel
        value={sort}
        onChange={onSortChange}
        options={FORECAST_SORT_OPTIONS}
        className="w-44"
      />
    </div>
  );
}
