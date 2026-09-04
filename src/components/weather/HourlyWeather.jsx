import { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { groupHourlyByDay } from '../../utils/transform';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { SectionHeading } from '../common/SectionHeading';
import { HourlyDaySelector } from './HourlyDaySelector';
import { HourlyWeatherRow } from './HourlyWeatherRow';

/**
 * Hourly forecast. Receives the flat `hourly` array, groups it into days for the
 * selector (derived with useMemo — pure transform of a prop), and shows the
 * hours for whichever day the user picked as a horizontal scrolling strip.
 */
export function HourlyWeather({ hourly }) {
  const days = useMemo(() => groupHourlyByDay(hourly), [hourly]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeDay = days[selectedIndex] ?? days[0];
  const showNow = selectedIndex === 0; // the first column of "Today" is labelled "Now"

  return (
    <Card as="section" aria-label="Hourly weather" className="h-full">
      <SectionHeading title="Hourly Weather" icon={Clock} />

      {days.length === 0 ? (
        <EmptyState title="No hourly data available" />
      ) : (
        <>
          <HourlyDaySelector
            days={days}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
          <ul
            className="-mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 pb-2"
            aria-label={`Hourly weather for ${activeDay.dateKey}`}
          >
            {activeDay.hours.map((hour, index) => (
              <HourlyWeatherRow
                key={hour.time}
                hour={hour}
                isNow={showNow && index === 0}
              />
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
