import { getWeatherDescription } from './weatherCodes';
import { degreesToCompass } from './wind';

/**
 * Turns the raw Open-Meteo JSON into the application's own shape.
 *
 * The API returns weather as several parallel arrays (time[], temperature_2m[],
 * weather_code[] …). The UI wants a list of objects, one per hour / day, so we
 * "zip" those arrays together here. Nothing else in the app touches the raw
 * response — components only ever see these transformed objects.
 */

function numberOrNull(value) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : null;
}

export function transformCurrentWeather(raw) {
  const current = raw?.current;
  if (!current) return null;

  const weatherCode = numberOrNull(current.weather_code);
  return {
    temperature: numberOrNull(current.temperature_2m),
    feelsLike: numberOrNull(current.apparent_temperature),
    humidity: numberOrNull(current.relative_humidity_2m),
    precipitation: numberOrNull(current.precipitation),
    weatherCode,
    condition: getWeatherDescription(weatherCode),
    windSpeed: numberOrNull(current.wind_speed_10m),
    windDirectionDeg: numberOrNull(current.wind_direction_10m),
    windDirectionLabel: degreesToCompass(current.wind_direction_10m),
    cloudCover: numberOrNull(current.cloud_cover),
    pressure: numberOrNull(current.pressure_msl),
    isDay: current.is_day === 1,
    observedAt: current.time ?? null,
  };
}

export function transformDailyForecast(raw) {
  const daily = raw?.daily;
  if (!daily || !Array.isArray(daily.time)) return [];

  return daily.time.map((isoDate, index) => {
    const weatherCode = numberOrNull(daily.weather_code?.[index]);
    const tempMax = numberOrNull(daily.temperature_2m_max?.[index]);
    const tempMin = numberOrNull(daily.temperature_2m_min?.[index]);
    const tempAverage =
      tempMax !== null && tempMin !== null ? (tempMax + tempMin) / 2 : null;

    return {
      date: isoDate,
      weatherCode,
      condition: getWeatherDescription(weatherCode),
      tempMax,
      tempMin,
      tempAverage,
      precipitation: numberOrNull(daily.precipitation_sum?.[index]),
      precipitationProbability: numberOrNull(daily.precipitation_probability_max?.[index]),
      windSpeedMax: numberOrNull(daily.wind_speed_10m_max?.[index]),
      windDirectionDeg: numberOrNull(daily.wind_direction_10m_dominant?.[index]),
      windDirectionLabel: degreesToCompass(daily.wind_direction_10m_dominant?.[index]),
      sunrise: daily.sunrise?.[index] ?? null,
      sunset: daily.sunset?.[index] ?? null,
      uvIndexMax: numberOrNull(daily.uv_index_max?.[index]),
    };
  });
}

export function transformHourlyForecast(raw) {
  const hourly = raw?.hourly;
  if (!hourly || !Array.isArray(hourly.time)) return [];

  return hourly.time.map((isoTime, index) => {
    const weatherCode = numberOrNull(hourly.weather_code?.[index]);
    return {
      time: isoTime,
      temperature: numberOrNull(hourly.temperature_2m?.[index]),
      feelsLike: numberOrNull(hourly.apparent_temperature?.[index]),
      precipitation: numberOrNull(hourly.precipitation?.[index]),
      precipitationProbability: numberOrNull(hourly.precipitation_probability?.[index]),
      weatherCode,
      condition: getWeatherDescription(weatherCode),
      windSpeed: numberOrNull(hourly.wind_speed_10m?.[index]),
      windDirectionDeg: numberOrNull(hourly.wind_direction_10m?.[index]),
    };
  });
}

/** Groups the flat hourly list into days so the UI can offer a day selector. */
export function groupHourlyByDay(hours) {
  if (!Array.isArray(hours)) return [];
  const byDay = new Map();

  hours.forEach((hour) => {
    const dayKey = hour.time.slice(0, 10); // YYYY-MM-DD from the ISO string
    if (!byDay.has(dayKey)) byDay.set(dayKey, []);
    byDay.get(dayKey).push(hour);
  });

  return [...byDay.entries()].map(([dateKey, dayHours]) => ({
    dateKey,
    hours: dayHours,
  }));
}

/** Builds the object the WeatherDetails panel renders. */
export function buildWeatherDetails(current, today) {
  if (!current) return null;
  return {
    temperature: current.temperature,
    feelsLike: current.feelsLike,
    humidity: current.humidity,
    windSpeed: current.windSpeed,
    windDirectionDeg: current.windDirectionDeg,
    windDirectionLabel: current.windDirectionLabel,
    precipitation: current.precipitation,
    cloudCover: current.cloudCover,
    pressure: current.pressure,
    uvIndexMax: today?.uvIndexMax ?? null,
    sunrise: today?.sunrise ?? null,
    sunset: today?.sunset ?? null,
  };
}

/** Top-level transform: raw response -> everything the dashboard needs. */
export function transformForecastResponse(raw) {
  const daily = transformDailyForecast(raw);
  const hourly = transformHourlyForecast(raw);
  const current = transformCurrentWeather(raw);

  return {
    current,
    daily,
    hourly,
    details: buildWeatherDetails(current, daily[0]),
  };
}
