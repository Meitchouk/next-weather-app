"use client";

import { useState, useCallback } from "react";
import type { WeatherState } from "@/types";
import { fetchWeatherByCity } from "@/services";

/**
 * Custom hook that encapsulates weather fetching logic.
 *
 * Follows the Custom Hook pattern to separate business logic
 * from presentation, making components cleaner and logic reusable.
 */
export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    data: null,
    status: "idle",
    error: null,
  });

  const searchWeather = useCallback(async (city: string) => {
    setState({ data: null, status: "loading", error: null });

    try {
      const weatherData = await fetchWeatherByCity(city);
      setState({ data: weatherData, status: "success", error: null });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado.";
      setState({ data: null, status: "error", error: message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, status: "idle", error: null });
  }, []);

  return {
    ...state,
    searchWeather,
    reset,
  };
}
