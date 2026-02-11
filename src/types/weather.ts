/** Raw response shape from OpenWeatherMap current-weather API */
export interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
  timezone: number;
  cod: number;
}

/** Single entry inside the forecast "list" array */
export interface ForecastEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  pop: number;
  dt_txt: string;
}

/** Raw response shape from OpenWeatherMap 5-day forecast API */
export interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastEntry[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/** Aggregated daily forecast */
export interface DailyForecast {
  /** YYYY-MM-DD */
  date: string;
  /** 0=Sunday, 6=Saturday */
  dayOfWeek: number;
  /** Celsius */
  tempDay: number;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
  humidity: number;
  /** m/s */
  windSpeed: number;
  /** 0–100, max for the day */
  pop: number;
}

/** Internal weather data model used across the app */
export interface WeatherData {
  city: string;
  /** ISO 3166-1 alpha-2 */
  country: string;
  /** Celsius */
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  /** hPa */
  pressure: number;
  description: string;
  /** OpenWeatherMap icon code (e.g. "01d") */
  icon: string;
  /** m/s */
  windSpeed: number;
  /** degrees */
  windDeg: number;
  windGust?: number;
  clouds: number;
  /** meters (max 10000) */
  visibility: number;
  /** Unix timestamp UTC */
  sunrise: number;
  /** Unix timestamp UTC */
  sunset: number;
  /** Offset from UTC in seconds */
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
}

/** Raw response from OpenWeatherMap Geocoding API */
export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}


export type WeatherStatus = "idle" | "loading" | "success" | "error";

export interface WeatherState {
  data: WeatherData | null;
  status: WeatherStatus;
  error: string | null;
}

export interface ForecastState {
  forecast: DailyForecast[];
  status: WeatherStatus;
  error: string | null;
}
