"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { WeatherState, DailyForecast } from "@/types";
import {
  fetchWeatherByCity,
  fetchForecast,
  WeatherServiceError,
  errorCodeToKey,
} from "@/services";

/**
 * Translates service error codes into locale-aware messages.
 * Cancels in-flight requests when a new search is triggered (AbortController).
 * Fetches the 5-day forecast alongside the current weather.
 */
export function useWeather() {
  const t = useTranslations("errors");
  const locale = useLocale();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<WeatherState>({
    data: null,
    status: "idle",
    error: null,
  });

  const [forecast, setForecast] = useState<DailyForecast[]>([]);

  const searchWeather = useCallback(
    async (city: string) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setState({ data: null, status: "loading", error: null });
      setForecast([]);

      try {
        const weatherData = await fetchWeatherByCity(city, {
          locale,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setState({ data: weatherData, status: "success", error: null });

          try {
            const dailyForecast = await fetchForecast(
              weatherData.coord.lat,
              weatherData.coord.lon,
              { locale, signal: controller.signal },
            );
            if (!controller.signal.aborted) {
              setForecast(dailyForecast);
            }
          } catch {
            // Forecast failure is non-critical — current weather still shows
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        let message: string;
        if (err instanceof WeatherServiceError) {
          message =
            err.code === "CITY_NOT_FOUND"
              ? t("cityNotFound", { city: err.cityName ?? city })
              : t(errorCodeToKey[err.code]);
        } else {
          message = t("unexpected");
        }
        setState({ data: null, status: "error", error: message });
      }
    },
    [locale, t]
  );

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({ data: null, status: "idle", error: null });
    setForecast([]);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...state,
    forecast,
    searchWeather,
    reset,
  };
}
