"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { GeocodingResult } from "@/types";
import { fetchCitySuggestions } from "@/services";

const DEBOUNCE_MS = 350;

export function useCitySuggestions() {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback((query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();

    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const results = await fetchCitySuggestions(query, controller.signal);
        if (!controller.signal.aborted) {
          setSuggestions(results);
          setLoading(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);
  }, []);

  const clearSuggestions = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();
    setSuggestions([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return { suggestions, loading, fetchSuggestions, clearSuggestions } as const;
}
