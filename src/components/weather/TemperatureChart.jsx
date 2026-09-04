import { useMemo, useState } from 'react';
import { LineChart as LineChartIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_METRICS, CHART_METRIC_OPTIONS } from '../../constants/forecast';
import { usePreferences } from '../../context/preferencesContext';
import { formatTime } from '../../utils/datetime';
import { convertTemperature, unitSymbol } from '../../utils/temperature';
import { convertWindSpeed, windUnitLabel } from '../../utils/wind';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';
import { Select } from '../common/Select';

/**
 * Hourly trend chart. The data transformation (parallel API arrays -> a list of
 * { label, value } points, in the user's units) is done here, by hand; Recharts
 * only draws the result.
 */
const HOURS_TO_PLOT = 24;

export function TemperatureChart({ hourly }) {
  const { temperatureUnit, windUnit } = usePreferences();
  const [metric, setMetric] = useState(CHART_METRICS.TEMPERATURE);

  const { data, unitLabel } = useMemo(() => {
    const slice = hourly.slice(0, HOURS_TO_PLOT);

    if (metric === CHART_METRICS.PRECIPITATION) {
      return {
        unitLabel: 'mm',
        data: slice.map((hour) => ({
          label: formatTime(hour.time),
          value: hour.precipitation ?? 0,
        })),
      };
    }

    if (metric === CHART_METRICS.WIND) {
      return {
        unitLabel: windUnitLabel(windUnit),
        data: slice.map((hour) => ({
          label: formatTime(hour.time),
          value: round(convertWindSpeed(hour.windSpeed, windUnit)),
        })),
      };
    }

    return {
      unitLabel: unitSymbol(temperatureUnit),
      data: slice.map((hour) => ({
        label: formatTime(hour.time),
        value: round(convertTemperature(hour.temperature, temperatureUnit)),
      })),
    };
  }, [hourly, metric, temperatureUnit, windUnit]);

  return (
    <Card as="section" aria-label="Hourly trend chart">
      <SectionHeading
        title="Hourly trend"
        icon={LineChartIcon}
        description={`Next ${HOURS_TO_PLOT} hours`}
        actions={
          <Select
            id="chart-metric"
            label="Metric"
            hideLabel
            value={metric}
            onChange={setMetric}
            options={CHART_METRIC_OPTIONS}
          />
        }
      />
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-brand)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--c-brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--c-border)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--c-subtle)' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={28}
              tickMargin={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--c-subtle)' }}
              tickLine={false}
              axisLine={false}
              width={40}
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(value) => `${Math.round(value)}`}
            />
            <Tooltip
              cursor={{ stroke: 'var(--c-brand)', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={<ChartTooltip unitLabel={unitLabel} name={metricLabel(metric)} />}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--c-brand)"
              strokeWidth={2.5}
              fill="url(#chart-fill)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--c-surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/** Compact, theme-aware tooltip. */
function ChartTooltip({ active, payload, label, unitLabel, name }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-subtle-border bg-surface px-3 py-2 text-xs shadow-float">
      <p className="font-semibold text-subtle">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-content">
        {payload[0].value} {unitLabel}
        <span className="ml-1 font-medium text-subtle">{name}</span>
      </p>
    </div>
  );
}

function round(value) {
  return value === null ? 0 : Math.round(value * 10) / 10;
}

function metricLabel(metric) {
  return CHART_METRIC_OPTIONS.find((option) => option.value === metric)?.label ?? '';
}
