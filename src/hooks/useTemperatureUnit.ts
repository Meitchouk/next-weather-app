"use client";

import { useState, useCallback } from "react";

export type TemperatureUnit = "celsius" | "fahrenheit";

const STORAGE_KEY = "temperatureUnit";

export function useTemperatureUnit() {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    if (typeof window === "undefined") return "celsius";
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as TemperatureUnit | null;
      if (saved === "celsius" || saved === "fahrenheit") return saved;
    } catch {
      // Ignore
    }
    return "celsius";
  });

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next: TemperatureUnit = prev === "celsius" ? "fahrenheit" : "celsius";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const convertTemp = useCallback(
    (celsius: number): number =>
      unit === "fahrenheit" ? Math.round(celsius * (9 / 5) + 32) : celsius,
    [unit]
  );

  const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";

  return { unit, unitSymbol, toggleUnit, convertTemp } as const;
}
