import axios from "axios";
import type { OpenWeatherResponse, WeatherData } from "@/types";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

/**
 * Adapter: transforms the raw OpenWeatherMap response into our internal model.
 * This isolates the rest of the app from external API shape changes.
 */
function adaptWeatherResponse(raw: OpenWeatherResponse): WeatherData {
  return {
    city: raw.name,
    temperature: Math.round(raw.main.temp),
    humidity: raw.main.humidity,
    description: raw.weather[0]?.description ?? "",
    icon: raw.weather[0]?.icon ?? "01d",
  };
}

/**
 * Fetches weather data for a given city.
 *
 * Uses the Service / Repository pattern to encapsulate all API interaction
 * in a single module, making it easy to mock in tests and swap implementations.
 *
 * @param city - Name of the city to search
 * @returns Normalized WeatherData object
 * @throws Error with a user-friendly message on failure
 */
export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  if (!city.trim()) {
    throw new Error("Por favor, ingresa el nombre de una ciudad.");
  }

  try {
    const { data } = await axios.get<OpenWeatherResponse>(BASE_URL, {
      params: {
        q: city.trim(),
        appid: API_KEY,
        units: "metric",
        lang: "es",
      },
    });

    return adaptWeatherResponse(data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 404) {
        throw new Error(
          `No se encontró la ciudad "${city}". Verifica el nombre e intenta de nuevo.`
        );
      }
      if (err.response.status === 401) {
        throw new Error(
          "API Key inválida. Verifica tu configuración."
        );
      }
    }
    throw new Error(
      "Ocurrió un error al obtener el clima. Intenta de nuevo más tarde."
    );
  }
}
