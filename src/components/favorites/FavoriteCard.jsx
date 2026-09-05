import { ArrowRight, Clock3, Droplets, MapPin, Star, Trash2, Wind } from 'lucide-react';
import { ICON_TONES } from '../../constants/iconTones';
import { useWeather } from '../../hooks/useWeather';
import { formatUpdatedAt } from '../../utils/datetime';
import { TemperatureValue } from '../common/TemperatureValue';
import { WeatherIcon } from '../weather/WeatherIcon';

/**
 * One saved location, rendered as a self-contained card. Fetches its own
 * quick weather preview via `useWeather` — each card loads/aborts
 * independently, the same pattern `ComparisonColumn` uses per-location.
 *
 * "Open" and "Remove" are explicit buttons rather than a card-wide click
 * target, so the card can hold other focusable content without ambiguity
 * about what a click on it does.
 */
export function FavoriteCard({ favorite, isActive, onSelect, onRemove }) {
  const region = [favorite.admin1, favorite.country].filter(Boolean).join(', ');
  const { weather, isLoading } = useWeather(favorite);
  const current = weather?.current;

  return (
    <li
      className={`relative flex flex-col overflow-hidden rounded-xl border bg-surface p-4 transition-colors ${
        isActive ? 'border-brand bg-brand-soft' : 'border-subtle-border hover:border-brand/50'
      }`}
    >
      <WeatherIcon
        code={current?.weatherCode}
        isDay={current?.isDay ?? true}
        className="pointer-events-none absolute -right-4 -top-6 -z-0 h-28 w-28 rotate-6 opacity-[0.1]"
        tinted={Boolean(current)}
      />

      <div className="relative flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-semibold text-content">
            <span className="truncate">{favorite.name}</span>
            <Star className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" fill="currentColor" />
            {isActive ? (
              <span className="shrink-0 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-contrast">
                Active
              </span>
            ) : null}
          </p>
          <p className="truncate text-sm text-muted">{region || '—'}</p>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-3">
        <WeatherIcon
          code={current?.weatherCode}
          isDay={current?.isDay ?? true}
          className="h-10 w-10 shrink-0"
          tinted={Boolean(current)}
        />
        <div className="min-w-0">
          {isLoading || !current ? (
            <p className="text-2xl font-bold text-subtle">—</p>
          ) : (
            <TemperatureValue
              celsius={current.temperature}
              className="block text-2xl font-bold leading-none text-content"
            />
          )}
          <p className="mt-1 truncate text-xs text-muted">{current?.condition ?? 'No data'}</p>
        </div>
      </div>

      <dl className="relative mt-4 grid grid-cols-3 gap-2 border-t border-subtle-border/70 pt-3 text-xs">
        <Stat icon={Droplets} tone={ICON_TONES.humidity} label="Humidity">
          {current?.humidity != null ? `${current.humidity}%` : '—'}
        </Stat>
        <Stat icon={Wind} tone={ICON_TONES.wind} label="Wind">
          {current?.windSpeed != null ? `${Math.round(current.windSpeed)} km/h` : '—'}
        </Stat>
        <Stat icon={Droplets} tone={ICON_TONES.precipitation} label="Precip">
          {current?.precipitation != null ? `${current.precipitation} mm` : '—'}
        </Stat>
      </dl>

      <p className="relative mt-3 flex items-center gap-1.5 text-xs text-subtle">
        <Clock3 className="h-3 w-3" aria-hidden="true" />
        {current ? `Updated ${formatUpdatedAt(current.observedAt)}` : 'Not loaded yet'}
      </p>

      <div className="relative mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelect(favorite)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-raised px-3 py-2 text-sm font-semibold text-content transition-colors hover:bg-brand-soft hover:text-brand"
        >
          Open
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(favorite.id)}
          aria-label={`Remove ${favorite.name} from favorites`}
          className="shrink-0 rounded-lg border border-danger/30 bg-danger/10 p-2 text-danger transition-colors hover:bg-danger/20"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function Stat({ icon: Icon, tone, label, children }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wide text-subtle">
        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${tone}`}>
          <Icon className="h-2.5 w-2.5" aria-hidden="true" />
        </span>
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-0.5 truncate font-semibold tabular-nums text-content">{children}</dd>
    </div>
  );
}
