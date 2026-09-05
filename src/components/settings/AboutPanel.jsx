import { Info } from 'lucide-react';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';

// Static facts about the app itself — not a preference, so it isn't wired
// through PreferencesContext. Values reflect what the app actually does
// (Open-Meteo for weather data, LocalStorage for persistence), not placeholders.
const ROWS = [
  { label: 'Version', value: '1.0.0' },
  { label: 'Built with', value: 'React & Vite' },
  { label: 'Weather data', value: 'Open-Meteo' },
  { label: 'Storage', value: 'Browser LocalStorage' },
];

export function AboutPanel() {
  return (
    <Card as="section" aria-label="About" className="h-fit">
      <SectionHeading title="About" icon={Info} description="Application information" />
      <dl>
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 border-b border-subtle-border/60 py-2.5 last:border-b-0"
          >
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="text-sm font-semibold text-content">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
