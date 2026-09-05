import {
  WiCloud,
  WiCloudy,
  WiDayCloudy,
  WiDayCloudyHigh,
  WiDayFog,
  WiDayRain,
  WiDayShowers,
  WiDaySnow,
  WiDaySunny,
  WiDayThunderstorm,
  WiFog,
  WiNightAltCloudy,
  WiNightAltRain,
  WiNightAltShowers,
  WiNightAltSnow,
  WiNightAltThunderstorm,
  WiNightClear,
  WiRain,
  WiRainMix,
  WiShowers,
  WiSleet,
  WiSnow,
  WiSprinkle,
  WiThunderstorm,
} from 'react-icons/wi';
import { WEATHER_GROUPS, getWeatherDescription, getWeatherGroup } from '../../utils/weatherCodes';

/**
 * Maps a WMO weather code to a dedicated weather icon (react-icons "Weather
 * Icons" set — NOT the generic Lucide set, which is kept only for UI controls).
 *
 * `CODE_ICONS` handles the codes where a nuance matters (partly cloudy vs
 * overcast, drizzle vs rain, freezing rain, snow grains). Everything else falls
 * back to `GROUP_ICONS`, keyed off the same weather groups the rest of the app
 * already uses. Every entry has a day and a night variant.
 *
 * The icon is decorative — the text condition is always shown next to it — so it
 * is hidden from assistive tech.
 */
const GROUP_ICONS = {
  [WEATHER_GROUPS.CLEAR]: { day: WiDaySunny, night: WiNightClear },
  [WEATHER_GROUPS.CLOUDY]: { day: WiDayCloudy, night: WiNightAltCloudy },
  [WEATHER_GROUPS.FOG]: { day: WiDayFog, night: WiFog },
  [WEATHER_GROUPS.DRIZZLE]: { day: WiSprinkle, night: WiSprinkle },
  [WEATHER_GROUPS.RAIN]: { day: WiDayRain, night: WiNightAltRain },
  [WEATHER_GROUPS.SHOWERS]: { day: WiDayShowers, night: WiNightAltShowers },
  [WEATHER_GROUPS.SNOW]: { day: WiDaySnow, night: WiNightAltSnow },
  [WEATHER_GROUPS.THUNDERSTORM]: { day: WiDayThunderstorm, night: WiNightAltThunderstorm },
  [WEATHER_GROUPS.UNKNOWN]: { day: WiCloud, night: WiCloud },
};

const CODE_ICONS = {
  1: { day: WiDaySunny, night: WiNightClear }, // mainly clear
  2: { day: WiDayCloudyHigh, night: WiNightAltCloudy }, // partly cloudy
  3: { day: WiCloudy, night: WiCloudy }, // overcast
  56: { day: WiRainMix, night: WiRainMix }, // freezing drizzle
  57: { day: WiRainMix, night: WiRainMix },
  66: { day: WiSleet, night: WiSleet }, // freezing rain
  67: { day: WiSleet, night: WiSleet },
  77: { day: WiSnow, night: WiSnow }, // snow grains
  80: { day: WiDayShowers, night: WiNightAltShowers },
  81: { day: WiShowers, night: WiShowers },
  82: { day: WiRain, night: WiRain }, // violent showers
  95: { day: WiThunderstorm, night: WiThunderstorm },
};

// Restrained, intentional colour per condition — a warm sun, a cool sky for
// wet/cold weather, a steel blue for clouds and a teal for fog (never a flat
// grey, which reads as "uncoloured" next to the saturated sun/storm tints).
const GROUP_TINT = {
  [WEATHER_GROUPS.CLEAR]: 'text-accent',
  [WEATHER_GROUPS.CLOUDY]: 'text-icon-cloud',
  [WEATHER_GROUPS.FOG]: 'text-icon-fog',
  [WEATHER_GROUPS.DRIZZLE]: 'text-brand',
  [WEATHER_GROUPS.RAIN]: 'text-brand',
  [WEATHER_GROUPS.SHOWERS]: 'text-brand',
  [WEATHER_GROUPS.SNOW]: 'text-icon-snow',
  [WEATHER_GROUPS.THUNDERSTORM]: 'text-icon-storm',
  [WEATHER_GROUPS.UNKNOWN]: 'text-subtle',
};

export function WeatherIcon({ code, isDay = true, className = 'h-6 w-6', tinted = true }) {
  const group = getWeatherGroup(code);
  const set = CODE_ICONS[code] ?? GROUP_ICONS[group] ?? GROUP_ICONS[WEATHER_GROUPS.UNKNOWN];
  const Icon = isDay ? set.day : set.night;
  const tint = tinted ? (GROUP_TINT[group] ?? 'text-brand') : '';

  return (
    <Icon
      className={`${tint} ${className}`}
      aria-hidden="true"
      data-condition={getWeatherDescription(code)}
    />
  );
}
