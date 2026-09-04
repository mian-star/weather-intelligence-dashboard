import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, CalendarX } from 'lucide-react';
import {
  DEFAULT_HOT_THRESHOLD_C,
  FORECAST_FILTERS,
  FORECAST_SORTS,
} from '../../constants/forecast';
import { staggerParent } from '../../utils/motion';
import { applyForecastFilter, sortForecastDays } from '../../utils/forecast';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { SectionHeading } from '../common/SectionHeading';
import { ForecastCard } from './ForecastCard';
import { ForecastControls } from './ForecastControls';

/**
 * 7-day forecast — a row of day cards (a horizontal scroll strip on small
 * screens, a wrapping grid on wider ones) with client-side filtering and
 * sorting.
 *
 * `filter`, `hotThreshold` and `sort` are local UI state. The list that gets
 * rendered is *derived* from `days` + those three values via useMemo — it is
 * never stored, so it can't drift out of sync with the source data. useMemo is
 * used here because we re-sort a copy of the array on every render otherwise,
 * even when only an unrelated parent state (e.g. the theme) changed.
 */
export function Forecast({ days }) {
  const [filter, setFilter] = useState(FORECAST_FILTERS.ALL);
  const [hotThreshold, setHotThreshold] = useState(String(DEFAULT_HOT_THRESHOLD_C));
  const [sort, setSort] = useState(FORECAST_SORTS.DEFAULT);

  const visibleDays = useMemo(() => {
    const threshold = Number(hotThreshold);
    const filtered = applyForecastFilter(
      days,
      filter,
      Number.isFinite(threshold) ? threshold : DEFAULT_HOT_THRESHOLD_C,
    );
    return sortForecastDays(filtered, sort);
  }, [days, filter, hotThreshold, sort]);

  // The overall low → high across the visible days. Shared scale for the little
  // temperature bar on every card, so the bars stay comparable.
  const range = useMemo(() => {
    const mins = visibleDays.map((day) => day.tempMin).filter((value) => value !== null);
    const maxs = visibleDays.map((day) => day.tempMax).filter((value) => value !== null);
    if (mins.length === 0 || maxs.length === 0) return null;
    return { min: Math.min(...mins), max: Math.max(...maxs) };
  }, [visibleDays]);

  return (
    <Card as="section" aria-label="Seven day forecast">
      <SectionHeading
        title="7-Day Forecast"
        icon={CalendarDays}
        description={`Showing ${visibleDays.length} of ${days.length} days`}
      />

      <ForecastControls
        filter={filter}
        onFilterChange={setFilter}
        hotThreshold={hotThreshold}
        onHotThresholdChange={setHotThreshold}
        sort={sort}
        onSortChange={setSort}
      />

      {visibleDays.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No forecast days match this filter"
          hint="Try a different filter or widen the temperature threshold."
        />
      ) : (
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5 xl:grid-cols-7"
        >
          {visibleDays.map((day) => (
            <ForecastCard key={day.date} day={day} range={range} />
          ))}
        </motion.div>
      )}
    </Card>
  );
}
