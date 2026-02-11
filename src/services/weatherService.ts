import axios from "axios";
import type {
  OpenWeatherResponse,
  OpenWeatherForecastResponse,
  ForecastEntry,
  WeatherData,
  DailyForecast,
  GeocodingResult,
} from "@/types";
import { config } from "@/config";
import { WeatherServiceError } from "./errors";

export type { WeatherErrorCode } from "./errors";
export { WeatherServiceError, errorCodeToKey } from "./errors";

export interface FetchWeatherOptions {
  locale?: string;
  signal?: AbortSignal;
}

/**
 * Adapter: transforms the raw OpenWeatherMap response into our internal model.
 * Isolates the rest of the app from external API shape changes.
 */
export function adaptWeatherResponse(raw: OpenWeatherResponse): WeatherData {
  return {
    city: raw.name,
    country: raw.sys.country,
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    tempMin: Math.round(raw.main.temp_min),
    tempMax: Math.round(raw.main.temp_max),
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    description: raw.weather[0]?.description ?? "",
    icon: raw.weather[0]?.icon ?? "01d",
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg,
    windGust: raw.wind.gust,
    clouds: raw.clouds.all,
    visibility: raw.visibility,
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    timezone: raw.timezone,
    coord: { lat: raw.coord.lat, lon: raw.coord.lon },
  };
}

export async function fetchWeatherByCity(
  city: string,
  options?: FetchWeatherOptions,
): Promise<WeatherData> {
  if (!city.trim()) {
    throw new WeatherServiceError("EMPTY_CITY");
  }

  try {
    const { data } = await axios.get<OpenWeatherResponse>(config.openWeather.baseUrl, {
      params: {
        q: city.trim(),
        appid: config.openWeather.apiKey,
        units: "metric",
        lang: options?.locale ?? "es",
      },
      signal: options?.signal,
    });

    return adaptWeatherResponse(data);
  } catch (err) {
    // Re-throw cancellations so callers can ignore aborted requests
    if (axios.isCancel(err)) throw err;

    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 404) {
        throw new WeatherServiceError("CITY_NOT_FOUND", city);
      }
      if (err.response.status === 401) {
        throw new WeatherServiceError("INVALID_API_KEY");
      }
    }
    throw new WeatherServiceError("NETWORK_ERROR");
  }
}

export async function fetchCitySuggestions(
  query: string,
  signal?: AbortSignal,
  limit = 5,
): Promise<GeocodingResult[]> {
  if (!query.trim() || query.trim().length < 2) return [];

  try {
    const { data } = await axios.get<GeocodingResult[]>(config.openWeather.geoUrl, {
      params: {
        q: query.trim(),
        limit,
        appid: config.openWeather.apiKey,
      },
      signal,
    });
    return data;
  } catch {
    return [];
  }
}

/**
 * Aggregates 3-hour forecast entries into daily summaries.
 * Groups by date, computes min/max temp, avg humidity/wind,
 * and picks the most frequent icon as representative.
 */
export function adaptForecastResponse(raw: OpenWeatherForecastResponse): DailyForecast[] {
  const grouped = new Map<string, ForecastEntry[]>();

  for (const entry of raw.list) {
    const dateKey = entry.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
    const arr = grouped.get(dateKey) ?? [];
    arr.push(entry);
    grouped.set(dateKey, arr);
  }

  const dailyForecasts: DailyForecast[] = [];

  for (const [dateKey, entries] of grouped) {
    const temps = entries.map((e) => e.main.temp);
    const humidities = entries.map((e) => e.main.humidity);
    const winds = entries.map((e) => e.wind.speed);
    const pops = entries.map((e) => e.pop);

    // Pick the most frequent icon as representative
    const iconCounts = new Map<string, number>();
    for (const e of entries) {
      const ic = e.weather[0]?.icon ?? "01d";
      iconCounts.set(ic, (iconCounts.get(ic) ?? 0) + 1);
    }
    let bestIcon = "01d";
    let bestCount = 0;
    for (const [ic, count] of iconCounts) {
      if (count > bestCount) {
        bestIcon = ic;
        bestCount = count;
      }
    }

    // Pick the description matching the best icon
    const matchingEntry = entries.find((e) => e.weather[0]?.icon === bestIcon);
    const description = matchingEntry?.weather[0]?.description ?? "";

    const date = new Date(dateKey + "T12:00:00Z");

    dailyForecasts.push({
      date: dateKey,
      dayOfWeek: date.getUTCDay(),
      tempDay: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      icon: bestIcon,
      description,
      humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
      windSpeed: Math.round(winds.reduce((a, b) => a + b, 0) / winds.length * 10) / 10,
      pop: Math.round(Math.max(...pops) * 100),
    });
  }

  return dailyForecasts;
}

export async function fetchForecast(
  lat: number,
  lon: number,
  options?: FetchWeatherOptions,
): Promise<DailyForecast[]> {
  try {
    const { data } = await axios.get<OpenWeatherForecastResponse>(config.openWeather.forecastUrl, {
      params: {
        lat,
        lon,
        appid: config.openWeather.apiKey,
        units: "metric",
        lang: options?.locale ?? "es",
      },
      signal: options?.signal,
    });

    return adaptForecastResponse(data);
  } catch (err) {
    if (axios.isCancel(err)) throw err;
    throw new WeatherServiceError("NETWORK_ERROR");
  }
}

/** Falls back to "unknown.png" if the icon code is unrecognised. */
export function getWeatherIconPath(iconCode: string): string {
  const VALID_ICONS = [
    "01d", "01n", "02d", "02n", "03d", "03n", "04d", "04n",
    "09d", "09n", "10d", "10n", "11d", "11n", "13d", "13n",
    "50d", "50n",
  ];
  const code = VALID_ICONS.includes(iconCode) ? iconCode : "unknown";
  return `/icons/${code}.png`;
}
