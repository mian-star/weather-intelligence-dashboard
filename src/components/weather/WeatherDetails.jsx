import { SlidersHorizontal } from 'lucide-react';
import { usePreferences } from '../../context/preferencesContext';
import { formatTime } from '../../utils/datetime';
import { formatTemperature } from '../../utils/temperature';
import { formatWindSpeed } from '../../utils/wind';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';

/**
 * Detailed metric panel. Receives the pre-built `details` object (never the raw
 * API response) and renders each metric as a compact label/value row so all 11
 * fit a narrow dashboard column. Missing fields fall back to "—".
 */
export function WeatherDetails({ details }) {
  const { temperatureUnit, windUnit } = usePreferences();

  const rows = [
    { label: 'Temperature', value: formatTemperature(details.temperature, temperatureUnit) },
    { label: 'Feels like', value: formatTemperature(details.feelsLike, temperatureUnit) },
    { label: 'Humidity', value: details.humidity !== null ? `${details.humidity}%` : '—' },
    { label: 'Wind speed', value: formatWindSpeed(details.windSpeed, windUnit) },
    {
      label: 'Wind direction',
      value:
        details.windDirectionLabel && details.windDirectionLabel !== '—'
          ? details.windDirectionDeg !== null
            ? `${details.windDirectionLabel} (${Math.round(details.windDirectionDeg)}°)`
            : details.windDirectionLabel
          : '—',
    },
    {
      label: 'Precipitation',
      value: details.precipitation !== null ? `${details.precipitation} mm` : '—',
    },
    {
      label: 'UV index (max)',
      value: details.uvIndexMax !== null ? Math.round(details.uvIndexMax) : '—',
    },
    { label: 'Cloud cover', value: details.cloudCover !== null ? `${details.cloudCover}%` : '—' },
    {
      label: 'Pressure',
      value: details.pressure !== null ? `${Math.round(details.pressure)} hPa` : '—',
    },
    { label: 'Sunrise', value: formatTime(details.sunrise) },
    { label: 'Sunset', value: formatTime(details.sunset) },
  ];

  return (
    <Card as="section" aria-label="Weather details" className="h-full">
      <SectionHeading title="Weather details" as="h2" icon={SlidersHorizontal} />
      <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 border-b border-subtle-border/60 py-2.5 last:border-b-0"
          >
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-content">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
