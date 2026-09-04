import { usePreferences } from '../../context/preferencesContext';
import { formatTemperature } from '../../utils/temperature';

/**
 * The single component responsible for rendering a temperature.
 *
 * It always receives the source value in Celsius and derives the displayed
 * value from the current unit preference — there is no Celsius/Fahrenheit
 * variant of this component and no second copy of the value in state.
 */
export function TemperatureValue({ celsius, className = '' }) {
  const { temperatureUnit } = usePreferences();
  return (
    <span className={`tabular-nums ${className}`}>
      {formatTemperature(celsius, temperatureUnit)}
    </span>
  );
}
