export {
  fetchWeatherByCity,
  fetchCitySuggestions,
  fetchForecast,
  adaptWeatherResponse,
  adaptForecastResponse,
  getWeatherIconPath,
  WeatherServiceError,
  errorCodeToKey,
} from "./weatherService";
export type { WeatherErrorCode, FetchWeatherOptions } from "./weatherService";
