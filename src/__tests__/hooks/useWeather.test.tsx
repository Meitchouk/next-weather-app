import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/theme";
import { useWeather } from "@/hooks/useWeather";
import * as weatherService from "@/services/weatherService";

// Mock the service module — partial mock to preserve WeatherServiceError class
jest.mock("@/services/weatherService", () => {
  const actual = jest.requireActual("@/services/weatherService");
  return {
    ...actual,
    fetchWeatherByCity: jest.fn(),
    fetchForecast: jest.fn().mockResolvedValue([]),
  };
});
const mockedFetch = weatherService.fetchWeatherByCity as jest.MockedFunction<
  typeof weatherService.fetchWeatherByCity
>;

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>;
}

function buildMockWeather(overrides?: Record<string, unknown>) {
  return {
    city: "Lima",
    country: "PE",
    temperature: 25,
    feelsLike: 27,
    tempMin: 22,
    tempMax: 28,
    humidity: 60,
    pressure: 1012,
    description: "cielo claro",
    icon: "01d",
    windSpeed: 3.1,
    windDeg: 90,
    clouds: 5,
    visibility: 10000,
    sunrise: 1700000000,
    sunset: 1700040000,
    timezone: -18000,
    coord: { lat: -12.04, lon: -77.03 },
    ...overrides,
  };
}

describe("useWeather hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should start in idle state", () => {
    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should transition idle → loading → success", async () => {
    const mockWeather = buildMockWeather();
    mockedFetch.mockResolvedValueOnce(mockWeather);

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("Lima");
    });

    expect(result.current.status).toBe("loading");

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.data).toEqual(mockWeather);
    expect(result.current.error).toBeNull();
  });

  it("should transition idle → loading → error (WeatherServiceError)", async () => {
    mockedFetch.mockRejectedValueOnce(
      new weatherService.WeatherServiceError("CITY_NOT_FOUND", "xyz")
    );

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("xyz");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toMatch(/No se encontró la ciudad/);
  });

  it("should handle unexpected (non-WeatherServiceError) errors", async () => {
    mockedFetch.mockRejectedValueOnce(new TypeError("Something broke"));

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("Test");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toMatch(/inesperado/);
  });

  it("should reset state back to idle", async () => {
    mockedFetch.mockResolvedValueOnce(buildMockWeather());

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("Lima");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should pass locale to fetchWeatherByCity", async () => {
    mockedFetch.mockResolvedValueOnce(buildMockWeather({ city: "Madrid" }));

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("Madrid");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    // useLocale() mock returns "es" by default
    expect(mockedFetch).toHaveBeenCalledWith(
      "Madrid",
      expect.objectContaining({ locale: "es" })
    );
  });

  it("should abort previous request when a new search is triggered", async () => {
    // First call will hang until aborted, second resolves
    mockedFetch
      .mockImplementationOnce(
        (_city, opts) =>
          new Promise((_resolve, reject) => {
            opts?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
          })
      )
      .mockResolvedValueOnce(buildMockWeather({ city: "Tokyo" }));

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("Lima");
    });

    // Immediately start second search (aborts the first)
    act(() => {
      result.current.searchWeather("Tokyo");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.data?.city).toBe("Tokyo");
    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });

  it("should ignore aborted request errors silently", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    mockedFetch.mockImplementation((_city, opts) => {
      return new Promise((_resolve, reject) => {
        if (opts?.signal?.aborted) {
          reject(abortError);
          return;
        }
        opts?.signal?.addEventListener("abort", () => reject(abortError));
      });
    });

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("Lima");
    });

    act(() => {
      result.current.reset();
    });

    // Should be idle, not error — aborted requests are ignored
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("should handle non-CITY_NOT_FOUND WeatherServiceError codes", async () => {
    mockedFetch.mockRejectedValueOnce(
      new weatherService.WeatherServiceError("NETWORK_ERROR")
    );

    const { result } = renderHook(() => useWeather(), { wrapper: Wrapper });

    act(() => {
      result.current.searchWeather("Test");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    // Should use errorCodeToKey mapping instead of cityNotFound message
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).not.toMatch(/No se encontró/);
  });
});
