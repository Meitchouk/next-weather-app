"use client";

import { useState, useCallback } from "react";

const MAX_HISTORY = 5;
const STORAGE_KEY = "weatherSearchHistory";

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as string[];
    } catch {
      // Ignore parse/localStorage errors (SSR, privacy mode, etc.)
    }
    return [];
  });

  const addToHistory = useCallback((city: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const next = [city, ...filtered].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage might be full or disabled
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { history, addToHistory, clearHistory } as const;
}
