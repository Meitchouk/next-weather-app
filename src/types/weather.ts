/** Raw response shape from OpenWeatherMap API */
export interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  cod: number;
}

/** Internal weather data model used across the app */
export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
}

/** Possible states of a weather fetch operation */
export type WeatherStatus = "idle" | "loading" | "success" | "error";

/** State shape used by the useWeather hook */
export interface WeatherState {
  data: WeatherData | null;
  status: WeatherStatus;
  error: string | null;
}
