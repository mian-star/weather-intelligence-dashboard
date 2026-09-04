import { usePreferences } from '../../context/preferencesContext';
import { formatTemperature } from '../../utils/temperature';
import { formatWindSpeed } from '../../utils/wind';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import { TemperatureValue } from '../common/TemperatureValue';
import { WeatherIcon } from '../weather/WeatherIcon';

/**
 * One side of the comparison. Receives an already-loaded weather object (plus
 * its loading / error flags) and the location it belongs to.
 */
export function ComparisonColumn({ location, weather, isLoading, error }) {
  const { temperatureUnit, windUnit } = usePreferences();

  if (!location) {
    return <EmptyState title="Pick a location" />;
  }
  if (isLoading) return <Loading label={`Loading ${location.name}…`} />;
  if (error) {
    return <ErrorMessage title={`Could not load ${location.name}`} message="Try again later." />;
  }
  if (!weather?.current) {
    return <EmptyState title="No weather data" />;
  }

  const today = weather.daily[0];
  const { current } = weather;

  const rows = [
    { label: 'Feels like', value: formatTemperature(current.feelsLike, temperatureUnit) },
    { label: 'Max today', value: formatTemperature(today?.tempMax, temperatureUnit) },
    { label: 'Min today', value: formatTemperature(today?.tempMin, temperatureUnit) },
    { label: 'Precipitation', value: `${today?.precipitation ?? 0} mm` },
    { label: 'Wind', value: formatWindSpeed(current.windSpeed, windUnit) },
  ];

  return (
    <div className="rounded-2xl border border-subtle-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="h-11 w-11" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-content">{location.name}</p>
          <p className="text-xs text-muted">{current.condition}</p>
        </div>
      </div>

      <p className="mt-3">
        <TemperatureValue
          celsius={current.temperature}
          className="text-4xl font-extrabold tracking-tight text-content"
        />
      </p>

      <dl className="mt-3 space-y-2 border-t border-subtle-border/70 pt-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-semibold tabular-nums text-content">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
