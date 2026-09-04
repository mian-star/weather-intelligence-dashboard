import { useMemo, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { TEMPERATURE_UNITS, THEMES, WIND_UNITS } from '../../constants/preferences';
import { usePreferences } from '../../context/preferencesContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { SectionHeading } from '../common/SectionHeading';

const TEMPERATURE_OPTIONS = [
  { value: TEMPERATURE_UNITS.CELSIUS, label: 'Celsius (°C)' },
  { value: TEMPERATURE_UNITS.FAHRENHEIT, label: 'Fahrenheit (°F)' },
];
const WIND_OPTIONS = [
  { value: WIND_UNITS.KMH, label: 'Kilometres per hour' },
  { value: WIND_UNITS.MPH, label: 'Miles per hour' },
];
const THEME_OPTIONS = [
  { value: THEMES.LIGHT, label: 'Light' },
  { value: THEMES.DARK, label: 'Dark' },
];

const VALID_VALUES = {
  temperatureUnit: Object.values(TEMPERATURE_UNITS),
  windUnit: Object.values(WIND_UNITS),
  theme: Object.values(THEMES),
};

/**
 * Settings form.
 *
 * The fields are controlled local state (`draft`) so the user can change several
 * things and only apply them on submit. "Reset" reloads the draft from the
 * currently saved preferences. On submit the validated draft is written to
 * PreferencesContext, which persists it and re-themes the app.
 */
export function SettingsForm() {
  const preferences = usePreferences();

  const savedValues = useMemo(
    () => ({
      temperatureUnit: preferences.temperatureUnit,
      windUnit: preferences.windUnit,
      theme: preferences.theme,
    }),
    [preferences.temperatureUnit, preferences.windUnit, preferences.theme],
  );

  const [draft, setDraft] = useState(savedValues);
  const [status, setStatus] = useState(null);

  const isDirty = Object.keys(savedValues).some((key) => savedValues[key] !== draft[key]);

  const updateField = (field) => (value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setStatus(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const invalidField = Object.keys(VALID_VALUES).find(
      (field) => !VALID_VALUES[field].includes(draft[field]),
    );
    if (invalidField) {
      setStatus({ type: 'error', message: `"${invalidField}" has an invalid value.` });
      return;
    }

    preferences.setTemperatureUnit(draft.temperatureUnit);
    preferences.setWindUnit(draft.windUnit);
    preferences.setTheme(draft.theme);
    setStatus({ type: 'success', message: 'Preferences saved.' });
  };

  const handleReset = () => {
    setDraft(savedValues);
    setStatus(null);
  };

  return (
    <Card as="section" aria-label="Settings">
      <SectionHeading
        title="Settings"
        icon={Settings2}
        description="These preferences are saved in your browser."
      />
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Select
          id="settings-temperature"
          label="Temperature unit"
          value={draft.temperatureUnit}
          onChange={updateField('temperatureUnit')}
          options={TEMPERATURE_OPTIONS}
        />
        <Select
          id="settings-wind"
          label="Wind speed unit"
          value={draft.windUnit}
          onChange={updateField('windUnit')}
          options={WIND_OPTIONS}
        />
        <Select
          id="settings-theme"
          label="Theme"
          value={draft.theme}
          onChange={updateField('theme')}
          options={THEME_OPTIONS}
        />

        <div className="sm:col-span-2 flex items-center gap-3">
          <Button type="submit" disabled={!isDirty}>
            Save preferences
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset} disabled={!isDirty}>
            Reset
          </Button>
          {status ? (
            <p
              className={`text-sm ${
                status.type === 'success' ? 'text-success' : 'text-danger'
              }`}
              role="status"
            >
              {status.message}
            </p>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
