import { motion } from 'motion/react';
import { Droplets, Sunrise, Sunset } from 'lucide-react';
import { formatCompactDate, formatDayName, formatTime } from '../../utils/datetime';
import { staggerItem } from '../../utils/motion';
import { TemperatureValue } from '../common/TemperatureValue';
import { WeatherIcon } from './WeatherIcon';

/**
 * One day of the 7-day forecast, as a compact card: day name + date, weather
 * icon + condition, high / low, a temperature-range bar, precipitation and
 * sunrise / sunset.
 *
 * `range` is the {min,max} across the whole visible forecast — the shared scale
 * used to position this day's temperature bar so every card is comparable.
 */
export function ForecastCard({ day, range }) {
  const dayName = formatDayName(day.date);
  const dateLabel = formatCompactDate(day.date);
  const pop = day.precipitationProbability;

  return (
    <motion.div
      variants={staggerItem}
      className="flex w-40 shrink-0 snap-start flex-col gap-2 rounded-xl border border-subtle-border bg-surface p-3.5 md:w-auto"
    >
      <div>
        <p className="text-sm font-semibold text-content">{dayName}</p>
        <p className="text-xs text-subtle">{dateLabel}</p>
      </div>
      <WeatherIcon code={day.weatherCode} className="my-1 h-10 w-10" />
      <p className="text-xs text-muted">{day.condition}</p>
      <p className="text-base font-bold text-content">
        <TemperatureValue celsius={day.tempMax} />
        <span className="font-semibold text-subtle">
          {' / '}
          <TemperatureValue celsius={day.tempMin} />
        </span>
      </p>
      <TempRangeBar day={day} range={range} />
      <dl className="mt-1 space-y-1.5 border-t border-subtle-border pt-2 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          <dt className="sr-only">Precipitation</dt>
          <dd>
            {day.precipitation ?? 0} mm
            {pop !== null && pop !== undefined ? <span className="text-subtle"> · {pop}%</span> : null}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunrise className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">Sunrise</dt>
          <dd>{formatTime(day.sunrise)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunset className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">Sunset</dt>
          <dd>{formatTime(day.sunset)}</dd>
        </div>
      </dl>
    </motion.div>
  );
}

/**
 * A thin bar showing where this day's low→high sits inside the whole visible
 * forecast's low→high (`range`). Purely visual, full card width, and clipped so
 * it can never overflow the card. Omitted when there is no usable range
 * (one day, or every day identical). The position/length maths lives here only.
 */
function TempRangeBar({ day, range }) {
  const hasRange =
    range && range.max !== range.min && day.tempMin !== null && day.tempMax !== null;
  if (!hasRange) return null;

  const span = range.max - range.min;
  const left = ((day.tempMin - range.min) / span) * 100;
  const width = ((day.tempMax - day.tempMin) / span) * 100;

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-subtle-border"
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full bg-brand"
        style={{ marginLeft: `${left}%`, width: `${Math.max(width, 4)}%` }}
      />
    </div>
  );
}
