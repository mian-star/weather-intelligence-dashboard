import { Droplets, Wind } from 'lucide-react';
import { usePreferences } from '../../context/preferencesContext';
import { formatTime } from '../../utils/datetime';
import { formatWindSpeed } from '../../utils/wind';
import { TemperatureValue } from '../common/TemperatureValue';
import { WeatherIcon } from './WeatherIcon';

/**
 * A single hour inside the hourly strip. Receives one transformed `hour`;
 * `isNow` gives the first upcoming hour a subtle highlighted state.
 */
export function HourlyWeatherRow({ hour, isNow = false }) {
  const { windUnit } = usePreferences();

  return (
    <li
      className={`flex w-20 shrink-0 snap-start flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center ${
        isNow ? 'border-brand bg-brand-soft' : 'border-subtle-border bg-surface'
      }`}
    >
      <span className={`text-xs font-semibold ${isNow ? 'text-brand' : 'text-subtle'}`}>
        {isNow ? 'Now' : formatTime(hour.time)}
      </span>

      <WeatherIcon code={hour.weatherCode} className="h-7 w-7" />

      <TemperatureValue celsius={hour.temperature} className="text-sm font-bold text-content" />
      <span className="text-[0.7rem] text-subtle">
        <TemperatureValue celsius={hour.feelsLike} />
      </span>

      <span className="mt-0.5 flex items-center gap-0.5 text-[0.7rem] font-semibold text-brand">
        <Droplets className="h-3 w-3" aria-hidden="true" />
        {hour.precipitationProbability ?? 0}%
      </span>
      <span className="flex items-center gap-0.5 text-[0.7rem] text-subtle">
        <Wind className="h-3 w-3" aria-hidden="true" />
        {formatWindSpeed(hour.windSpeed, windUnit)}
      </span>
    </li>
  );
}
