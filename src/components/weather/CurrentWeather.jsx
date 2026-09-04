import { motion } from 'motion/react';
import { ArrowDown, ArrowUp, Clock3, Droplets, Gauge, Wind } from 'lucide-react';
import { ICON_TONES } from '../../constants/iconTones';
import { usePreferences } from '../../context/preferencesContext';
import { formatUpdatedAt } from '../../utils/datetime';
import { fadeUp } from '../../utils/motion';
import { formatWindSpeed } from '../../utils/wind';
import { WEATHER_GROUPS, getWeatherGroup } from '../../utils/weatherCodes';
import { TemperatureValue } from '../common/TemperatureValue';
import { FavoriteButton } from '../favorites/FavoriteButton';
import { WeatherIcon } from './WeatherIcon';

// Which `.wx-hero-*` background (defined in index.css) each weather group
// gets. Clear is the one case that also depends on day/night — every other
// group reads fine at any hour with the same soft wash.
const HERO_CLASS_BY_GROUP = {
  [WEATHER_GROUPS.CLEAR]: 'wx-hero-clear',
  [WEATHER_GROUPS.CLOUDY]: 'wx-hero-cloudy',
  [WEATHER_GROUPS.FOG]: 'wx-hero-fog',
  [WEATHER_GROUPS.DRIZZLE]: 'wx-hero-rain',
  [WEATHER_GROUPS.RAIN]: 'wx-hero-rain',
  [WEATHER_GROUPS.SHOWERS]: 'wx-hero-rain',
  [WEATHER_GROUPS.SNOW]: 'wx-hero-snow',
  [WEATHER_GROUPS.THUNDERSTORM]: 'wx-hero-storm',
  [WEATHER_GROUPS.UNKNOWN]: 'wx-hero-cloudy',
};

function getHeroClass(code, isDay) {
  const group = getWeatherGroup(code);
  if (group === WEATHER_GROUPS.CLEAR && !isDay) return 'wx-hero-night';
  return HERO_CLASS_BY_GROUP[group] ?? 'wx-hero-cloudy';
}

/**
 * The headline panel — the visual hero of the dashboard (grid Level 1).
 *
 * Receives the already-transformed `current` object, the active `location`, and
 * (optionally) `today` (the first day of the forecast) purely so the hero can
 * show the day's high / low. Re-renders whenever those props change, i.e.
 * whenever the user picks a new location.
 */
export function CurrentWeather({ current, location, today }) {
  const { windUnit } = usePreferences();

  const place = [location?.name, location?.admin1].filter(Boolean).join(', ');

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      aria-labelledby="current-weather-heading"
      className={`wx-hero ${getHeroClass(current.weatherCode, current.isDay)} h-full overflow-hidden rounded-2xl border border-subtle-border bg-surface p-5 shadow-soft sm:p-6`}
    >
      {/* Decorative watermark — negative z-index, so it paints behind the
          in-flow content below without needing that content to opt in. */}
      <WeatherIcon
        code={current.weatherCode}
        isDay={current.isDay}
        className="pointer-events-none absolute -right-6 -top-10 -z-10 h-40 w-40 rotate-6 opacity-[0.12] sm:h-52 sm:w-52"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-subtle">
            Current weather
          </p>
          <h2
            id="current-weather-heading"
            className="mt-1 text-xl font-bold tracking-tight text-content sm:text-2xl"
          >
            {place || 'Current location'}
          </h2>
          <p className="text-sm text-muted">{location?.country ?? '—'}</p>
        </div>
        <FavoriteButton location={location} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex items-center gap-4 sm:gap-5">
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
          />
          <div className="min-w-0">
            <TemperatureValue
              celsius={current.temperature}
              className="block text-5xl font-extrabold leading-none tracking-tight text-content sm:text-6xl"
            />
            <p className="mt-1.5 text-sm font-semibold text-content sm:text-base">
              {current.condition}
            </p>
            <p className="text-sm text-muted">
              Feels like <TemperatureValue celsius={current.feelsLike} className="font-semibold" />
            </p>
          </div>
        </div>

        {today ? (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="h-4 w-4 text-danger" aria-hidden="true" />
              <span className="text-subtle">High</span>
              <TemperatureValue celsius={today.tempMax} className="font-bold text-content" />
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowDown className="h-4 w-4 text-brand" aria-hidden="true" />
              <span className="text-subtle">Low</span>
              <TemperatureValue celsius={today.tempMin} className="font-bold text-content" />
            </div>
          </div>
        ) : null}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-subtle-border pt-4 sm:grid-cols-4">
        <Metric icon={Wind} label="Wind" tone={ICON_TONES.wind}>
          {formatWindSpeed(current.windSpeed, windUnit)}{' '}
          <span className="text-subtle">{current.windDirectionLabel}</span>
        </Metric>
        <Metric icon={Droplets} label="Humidity" tone={ICON_TONES.humidity}>
          {current.humidity ?? '—'}%
        </Metric>
        <Metric icon={Droplets} label="Precipitation" tone={ICON_TONES.precipitation}>
          {current.precipitation ?? 0} mm
        </Metric>
        <Metric icon={Gauge} label="Pressure" tone={ICON_TONES.pressure}>
          {current.pressure ? `${Math.round(current.pressure)} hPa` : '—'}
        </Metric>
      </dl>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-subtle">
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
        Last updated {formatUpdatedAt(current.observedAt)}
      </p>
    </motion.section>
  );
}

function Metric({ icon: Icon, label, tone, children }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-subtle">
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${tone}`}>
          <Icon className="h-3 w-3" aria-hidden="true" />
        </span>
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold tabular-nums text-content">{children}</dd>
    </div>
  );
}
