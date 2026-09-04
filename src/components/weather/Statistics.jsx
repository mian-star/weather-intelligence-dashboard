import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUp, CloudRain, Droplets, Sigma, TrendingUp, Wind } from 'lucide-react';
import { usePreferences } from '../../context/preferencesContext';
import { formatDayName } from '../../utils/datetime';
import { staggerItem, staggerParent } from '../../utils/motion';
import { calculateStatistics } from '../../utils/statistics';
import { formatTemperature } from '../../utils/temperature';
import { formatWindSpeed } from '../../utils/wind';
import { ICON_TONES } from '../../constants/iconTones';
import { DetailTile } from '../common/DetailTile';
import { SectionHeading } from '../common/SectionHeading';

/**
 * Weather statistics for the visible forecast window, rendered as a row of KPI
 * cards. Everything is computed from `days` with calculateStatistics() — nothing
 * is hardcoded.
 *
 * useMemo: calculateStatistics does a full reduce/map/filter pass over the
 * array. It only depends on `days`, so we don't want it re-running when an
 * unrelated re-render happens (theme toggle, favorite added, …). Temperatures
 * are computed in Celsius and formatted here for display. The "which day" note
 * under Highest/Lowest is derived here from `days` (the util doesn't track it).
 */
export function Statistics({ days }) {
  const { temperatureUnit, windUnit } = usePreferences();
  const stats = useMemo(() => calculateStatistics(days), [days]);

  const hottestDay = days.find((day) => day.tempMax === stats.highestTemp);
  const coldestDay = days.find((day) => day.tempMin === stats.lowestTemp);

  const tiles = [
    {
      icon: ArrowUp,
      label: 'Highest temp',
      value: formatTemperature(stats.highestTemp, temperatureUnit),
      sublabel: hottestDay ? formatDayName(hottestDay.date) : undefined,
      tone: ICON_TONES.temperatureHigh,
    },
    {
      icon: ArrowDown,
      label: 'Lowest temp',
      value: formatTemperature(stats.lowestTemp, temperatureUnit),
      sublabel: coldestDay ? formatDayName(coldestDay.date) : undefined,
      tone: ICON_TONES.temperatureLow,
    },
    {
      icon: Sigma,
      label: 'Average temp',
      value: formatTemperature(stats.averageTemp, temperatureUnit),
      sublabel: 'Next 7 days',
      tone: ICON_TONES.temperatureAverage,
    },
    {
      icon: Droplets,
      label: 'Total precipitation',
      value: `${stats.totalPrecipitation} mm`,
      tone: ICON_TONES.precipitation,
    },
    {
      icon: Wind,
      label: 'Max wind speed',
      value: formatWindSpeed(stats.maxWindSpeed, windUnit),
      tone: ICON_TONES.wind,
    },
    {
      icon: CloudRain,
      label: 'Rainy days',
      value: `${stats.rainyDayCount} of ${stats.dayCount}`,
      tone: ICON_TONES.rainyDays,
    },
  ];

  return (
    <section aria-label="Weather statistics" className="space-y-4">
      <SectionHeading
        title="Weather insights"
        icon={TrendingUp}
        description="Calculated from the 7-day forecast"
        tone={ICON_TONES.insights}
      />
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
      >
        {tiles.map((tile) => (
          <motion.div key={tile.label} variants={staggerItem}>
            <DetailTile
              icon={tile.icon}
              label={tile.label}
              value={tile.value}
              sublabel={tile.sublabel}
              tone={tile.tone}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
