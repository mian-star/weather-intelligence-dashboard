import { usePreferences } from '../../context/preferencesContext';
import { TEMPERATURE_UNITS } from '../../constants/preferences';

/**
 * Celsius / Fahrenheit switch. Writes straight to PreferencesContext, so every
 * TemperatureValue in the app updates with no page reload.
 */
export function UnitToggle() {
  const { temperatureUnit, setTemperatureUnit } = usePreferences();

  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="flex overflow-hidden rounded-xl border border-subtle-border text-sm"
    >
      {[
        { unit: TEMPERATURE_UNITS.CELSIUS, label: '°C' },
        { unit: TEMPERATURE_UNITS.FAHRENHEIT, label: '°F' },
      ].map(({ unit, label }) => (
        <button
          key={unit}
          type="button"
          aria-pressed={temperatureUnit === unit}
          onClick={() => setTemperatureUnit(unit)}
          className={`px-3 py-1.5 font-semibold transition-colors ${
            temperatureUnit === unit
              ? 'bg-brand text-brand-contrast'
              : 'bg-surface text-muted hover:text-content'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
