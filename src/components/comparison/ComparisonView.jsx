import { useMemo, useState } from 'react';
import { GitCompareArrows } from 'lucide-react';
import { TEMPERATURE_UNITS } from '../../constants/preferences';
import { usePreferences } from '../../context/preferencesContext';
import { useLocation } from '../../context/locationContext';
import { useWeather } from '../../hooks/useWeather';
import { unitSymbol } from '../../utils/temperature';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { SectionHeading } from '../common/SectionHeading';
import { Select } from '../common/Select';
import { ComparisonColumn } from './ComparisonColumn';

/**
 * Side-by-side comparison of two favorite locations. Each side loads its own
 * forecast through useWeather; the summary row is derived from both results.
 */
export function ComparisonView() {
  const { favorites } = useLocation();
  const { temperatureUnit } = usePreferences();

  const [leftId, setLeftId] = useState(() => favorites[0]?.id ?? '');
  const [rightId, setRightId] = useState(() => favorites[1]?.id ?? '');

  const options = favorites.map((favorite) => ({
    value: String(favorite.id),
    label: favorite.name,
  }));

  const left = favorites.find((favorite) => String(favorite.id) === String(leftId)) ?? null;
  const right = favorites.find((favorite) => String(favorite.id) === String(rightId)) ?? null;

  const leftWeather = useWeather(left);
  const rightWeather = useWeather(right);

  const summary = useMemo(() => {
    const a = leftWeather.weather?.current?.temperature;
    const b = rightWeather.weather?.current?.temperature;
    if (a === null || a === undefined || b === null || b === undefined) return null;
    const diff = Math.abs(a - b);
    const warmer = a === b ? null : a > b ? left?.name : right?.name;
    return { diff, warmer };
  }, [leftWeather.weather, rightWeather.weather, left, right]);

  // A temperature *difference* scales by 1.8 between C and F (no +32 offset).
  const formatDelta = (celsiusDelta, unit) => {
    const factor = unit === TEMPERATURE_UNITS.FAHRENHEIT ? 1.8 : 1;
    return `${Math.round(celsiusDelta * factor)}${unitSymbol(unit)}`;
  };

  if (favorites.length < 2) {
    return (
      <Card as="section" aria-label="Weather comparison">
        <SectionHeading title="Compare locations" icon={GitCompareArrows} />
        <EmptyState
          icon={GitCompareArrows}
          title="Add at least two favorites to compare"
          hint="Save two or more locations from the dashboard, then come back here."
        />
      </Card>
    );
  }

  return (
    <Card as="section" aria-label="Weather comparison">
      <SectionHeading
        title="Compare locations"
        icon={GitCompareArrows}
        description="Two saved locations, side by side"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Select id="compare-left" label="First location" value={String(leftId)} onChange={setLeftId} options={options} />
        <Select id="compare-right" label="Second location" value={String(rightId)} onChange={setRightId} options={options} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ComparisonColumn location={left} {...leftWeather} />
        <ComparisonColumn location={right} {...rightWeather} />
      </div>

      {summary ? (
        <p className="mt-4 rounded-xl bg-brand-soft p-3.5 text-sm font-medium text-content">
          {summary.warmer
            ? `${summary.warmer} is currently ${formatDelta(summary.diff, temperatureUnit)} warmer.`
            : 'Both locations are at the same temperature right now.'}
        </p>
      ) : null}
    </Card>
  );
}
