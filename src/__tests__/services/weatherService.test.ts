import axios from "axios";
import { AxiosError, AxiosHeaders } from "axios";
import {
  fetchWeatherByCity,
  fetchCitySuggestions,
  fetchForecast,
  adaptWeatherResponse,
  adaptForecastResponse,
  getWeatherIconPath,
  WeatherServiceError,
} from "@/services/weatherService";

// Partially mock axios — preserve AxiosError, isAxiosError, etc.
jest.mock("axios", () => {
  const actual = jest.requireActual<typeof import("axios")>("axios");
  return {
    __esModule: true,
    ...actual,
    default: {
      ...actual.default,
      get: jest.fn(),
      isAxiosError: actual.default.isAxiosError,
      isCancel: actual.default.isCancel,
    },
  };
});

const mockedGet = axios.get as jest.MockedFunction<typeof axios.get>;

/** Helper: builds a complete OpenWeatherMap-like API response */
function buildApiResponse(overrides?: Record<string, unknown>) {
  return {
    data: {
      name: "Madrid",
      main: { temp: 22.4, feels_like: 21.5, temp_min: 20, temp_max: 25, humidity: 55, pressure: 1013 },
      weather: [{ id: 800, main: "Clear", description: "cielo claro", icon: "01d" }],
      wind: { speed: 3.5, deg: 180, gust: 5.1 },
      clouds: { all: 10 },
      visibility: 10000,
      sys: { country: "ES", sunrise: 1700000000, sunset: 1700040000 },
      coord: { lat: 40.42, lon: -3.7 },
      dt: 1700020000,
      timezone: 3600,
      cod: 200,
      ...overrides,
    },
  };
}

describe("weatherService — fetchWeatherByCity", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return normalized weather data on a successful response", async () => {
    mockedGet.mockResolvedValueOnce(buildApiResponse());

    const result = await fetchWeatherByCity("Madrid");

    expect(result).toEqual({
      city: "Madrid",
      country: "ES",
      temperature: 22,
      feelsLike: 22,
      tempMin: 20,
      tempMax: 25,
      humidity: 55,
      pressure: 1013,
      description: "cielo claro",
      icon: "01d",
      windSpeed: 3.5,
      windDeg: 180,
      windGust: 5.1,
      clouds: 10,
      visibility: 10000,
      sunrise: 1700000000,
      sunset: 1700040000,
      timezone: 3600,
      coord: { lat: 40.42, lon: -3.7 },
    });

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(mockedGet).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/weather",
      expect.objectContaining({
        params: expect.objectContaining({ q: "Madrid", units: "metric" }),
      }),
    );
  });

  it("should pass locale and signal options to the API call", async () => {
    mockedGet.mockResolvedValueOnce(
      buildApiResponse({ name: "London", sys: { country: "GB", sunrise: 1700000000, sunset: 1700040000 } }),
    );
    const controller = new AbortController();

    await fetchWeatherByCity("London", {
      locale: "en",
      signal: controller.signal,
    });

    expect(mockedGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ lang: "en" }),
        signal: controller.signal,
      }),
    );
  });

  it("should throw CITY_NOT_FOUND when the city is not found (404)", async () => {
    const error = new AxiosError("Not Found", "ERR_BAD_REQUEST", undefined, undefined, {
      status: 404,
      statusText: "Not Found",
      data: {},
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    mockedGet.mockRejectedValueOnce(error);

    try {
      await fetchWeatherByCity("CiudadInexistente123");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WeatherServiceError);
      expect((err as WeatherServiceError).code).toBe("CITY_NOT_FOUND");
      expect((err as WeatherServiceError).cityName).toBe("CiudadInexistente123");
    }
  });

  it("should throw INVALID_API_KEY when the API key is invalid (401)", async () => {
    const error = new AxiosError("Unauthorized", "ERR_BAD_REQUEST", undefined, undefined, {
      status: 401,
      statusText: "Unauthorized",
      data: {},
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    mockedGet.mockRejectedValueOnce(error);

    try {
      await fetchWeatherByCity("Madrid");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WeatherServiceError);
      expect((err as WeatherServiceError).code).toBe("INVALID_API_KEY");
    }
  });

  it("should throw EMPTY_CITY when the city name is empty or whitespace", async () => {
    try {
      await fetchWeatherByCity("");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WeatherServiceError);
      expect((err as WeatherServiceError).code).toBe("EMPTY_CITY");
    }

    try {
      await fetchWeatherByCity("   ");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WeatherServiceError);
      expect((err as WeatherServiceError).code).toBe("EMPTY_CITY");
    }
  });

  it("should throw NETWORK_ERROR on network failure", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"));

    try {
      await fetchWeatherByCity("Madrid");
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WeatherServiceError);
      expect((err as WeatherServiceError).code).toBe("NETWORK_ERROR");
    }
  });
});

describe("adaptWeatherResponse", () => {
  it("should transform a full API response into internal model", () => {
    const result = adaptWeatherResponse({
      name: "Tokyo",
      main: { temp: 18.7, feels_like: 17.2, temp_min: 16, temp_max: 21, humidity: 62, pressure: 1015 },
      weather: [{ id: 802, main: "Clouds", description: "nubes dispersas", icon: "03d" }],
      wind: { speed: 4.2, deg: 270, gust: 6.0 },
      clouds: { all: 40 },
      visibility: 10000,
      sys: { country: "JP", sunrise: 1700000000, sunset: 1700040000 },
      coord: { lat: 35.68, lon: 139.69 },
      dt: 1700020000,
      timezone: 32400,
      cod: 200,
    });

    expect(result).toEqual({
      city: "Tokyo",
      country: "JP",
      temperature: 19,
      feelsLike: 17,
      tempMin: 16,
      tempMax: 21,
      humidity: 62,
      pressure: 1015,
      description: "nubes dispersas",
      icon: "03d",
      windSpeed: 4.2,
      windDeg: 270,
      windGust: 6.0,
      clouds: 40,
      visibility: 10000,
      sunrise: 1700000000,
      sunset: 1700040000,
      timezone: 32400,
      coord: { lat: 35.68, lon: 139.69 },
    });
  });

  it("should handle empty weather array gracefully", () => {
    const result = adaptWeatherResponse({
      name: "Unknown",
      main: { temp: 0, feels_like: 0, temp_min: 0, temp_max: 0, humidity: 0, pressure: 0 },
      weather: [],
      wind: { speed: 0, deg: 0 },
      clouds: { all: 0 },
      visibility: 0,
      sys: { country: "XX", sunrise: 0, sunset: 0 },
      coord: { lat: 0, lon: 0 },
      dt: 0,
      timezone: 0,
      cod: 200,
    });

    expect(result.description).toBe("");
    expect(result.icon).toBe("01d");
    expect(result.coord).toEqual({ lat: 0, lon: 0 });
  });

  it("should round temperature values to nearest integer", () => {
    const result = adaptWeatherResponse({
      name: "Test",
      main: { temp: 22.6, feels_like: 24.3, temp_min: 20.1, temp_max: 25.9, humidity: 50, pressure: 1010 },
      weather: [{ id: 800, main: "Clear", description: "clear", icon: "01d" }],
      wind: { speed: 1, deg: 0 },
      clouds: { all: 0 },
      visibility: 10000,
      sys: { country: "XX", sunrise: 0, sunset: 0 },
      coord: { lat: 0, lon: 0 },
      dt: 0,
      timezone: 0,
      cod: 200,
    });

    expect(result.temperature).toBe(23);
    expect(result.feelsLike).toBe(24);
    expect(result.tempMin).toBe(20);
    expect(result.tempMax).toBe(26);
    expect(result.coord).toEqual({ lat: 0, lon: 0 });
  });
});

describe("fetchCitySuggestions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return suggestions for a valid query", async () => {
    const mockSuggestions = [
      { name: "London", lat: 51.5, lon: -0.12, country: "GB", state: "England" },
      { name: "Londonderry", lat: 55.0, lon: -7.3, country: "GB", state: "Northern Ireland" },
    ];
    mockedGet.mockResolvedValueOnce({ data: mockSuggestions });

    const result = await fetchCitySuggestions("Lon");
    expect(result).toEqual(mockSuggestions);
    expect(mockedGet).toHaveBeenCalledWith(
      "https://api.openweathermap.org/geo/1.0/direct",
      expect.objectContaining({
        params: expect.objectContaining({ q: "Lon", limit: 5 }),
      }),
    );
  });

  it("should return empty array for short queries", async () => {
    const result = await fetchCitySuggestions("L");
    expect(result).toEqual([]);
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("should return empty array on error", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"));
    const result = await fetchCitySuggestions("London");
    expect(result).toEqual([]);
  });
});

describe("adaptForecastResponse", () => {
  function buildForecastEntry(overrides: Record<string, unknown> = {}) {
    return {
      dt: 1700020000,
      main: { temp: 20, feels_like: 18, temp_min: 17, temp_max: 23, humidity: 55, pressure: 1013 },
      weather: [{ id: 800, main: "Clear", description: "cielo claro", icon: "01d" }],
      wind: { speed: 3, deg: 180 },
      clouds: { all: 10 },
      visibility: 10000,
      pop: 0.2,
      dt_txt: "2024-11-15 12:00:00",
      ...overrides,
    };
  }

  it("should aggregate 3-hour entries into daily summaries", () => {
    const raw = {
      cod: "200",
      message: 0,
      cnt: 3,
      list: [
        buildForecastEntry({ dt_txt: "2024-11-15 09:00:00", main: { temp: 18, feels_like: 16, temp_min: 15, temp_max: 20, humidity: 50, pressure: 1013 } }),
        buildForecastEntry({ dt_txt: "2024-11-15 12:00:00", main: { temp: 22, feels_like: 20, temp_min: 20, temp_max: 25, humidity: 55, pressure: 1013 } }),
        buildForecastEntry({ dt_txt: "2024-11-15 15:00:00", main: { temp: 24, feels_like: 22, temp_min: 22, temp_max: 26, humidity: 60, pressure: 1013 } }),
      ],
      city: { id: 1, name: "Test", coord: { lat: 0, lon: 0 }, country: "XX", timezone: 0, sunrise: 0, sunset: 0 },
    };

    const result = adaptForecastResponse(raw);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2024-11-15");
    expect(result[0].tempMin).toBe(18);
    expect(result[0].tempMax).toBe(24);
  });

  it("should group entries by different dates", () => {
    const raw = {
      cod: "200",
      message: 0,
      cnt: 2,
      list: [
        buildForecastEntry({ dt_txt: "2024-11-15 12:00:00" }),
        buildForecastEntry({ dt_txt: "2024-11-16 12:00:00" }),
      ],
      city: { id: 1, name: "Test", coord: { lat: 0, lon: 0 }, country: "XX", timezone: 0, sunrise: 0, sunset: 0 },
    };

    const result = adaptForecastResponse(raw);
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2024-11-15");
    expect(result[1].date).toBe("2024-11-16");
  });

  it("should pick the most frequent icon as representative", () => {
    const raw = {
      cod: "200",
      message: 0,
      cnt: 3,
      list: [
        buildForecastEntry({ dt_txt: "2024-11-15 09:00:00", weather: [{ id: 800, main: "Clear", description: "cielo claro", icon: "01d" }] }),
        buildForecastEntry({ dt_txt: "2024-11-15 12:00:00", weather: [{ id: 802, main: "Clouds", description: "nubes", icon: "03d" }] }),
        buildForecastEntry({ dt_txt: "2024-11-15 15:00:00", weather: [{ id: 802, main: "Clouds", description: "nubes", icon: "03d" }] }),
      ],
      city: { id: 1, name: "Test", coord: { lat: 0, lon: 0 }, country: "XX", timezone: 0, sunrise: 0, sunset: 0 },
    };

    const result = adaptForecastResponse(raw);
    expect(result[0].icon).toBe("03d");
    expect(result[0].description).toBe("nubes");
  });

  it("should calculate max precipitation probability", () => {
    const raw = {
      cod: "200",
      message: 0,
      cnt: 2,
      list: [
        buildForecastEntry({ dt_txt: "2024-11-15 09:00:00", pop: 0.1 }),
        buildForecastEntry({ dt_txt: "2024-11-15 15:00:00", pop: 0.75 }),
      ],
      city: { id: 1, name: "Test", coord: { lat: 0, lon: 0 }, country: "XX", timezone: 0, sunrise: 0, sunset: 0 },
    };

    const result = adaptForecastResponse(raw);
    expect(result[0].pop).toBe(75); // 0.75 * 100
  });
});

describe("fetchForecast", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return daily forecast for given coordinates", async () => {
    const mockResponse = {
      data: {
        cod: "200",
        message: 0,
        cnt: 1,
        list: [
          {
            dt: 1700020000,
            main: { temp: 20, feels_like: 18, temp_min: 17, temp_max: 23, humidity: 55, pressure: 1013 },
            weather: [{ id: 800, main: "Clear", description: "cielo claro", icon: "01d" }],
            wind: { speed: 3, deg: 180 },
            clouds: { all: 10 },
            visibility: 10000,
            pop: 0.2,
            dt_txt: "2024-11-15 12:00:00",
          },
        ],
        city: { id: 1, name: "Lima", coord: { lat: -12.04, lon: -77.03 }, country: "PE", timezone: -18000, sunrise: 0, sunset: 0 },
      },
    };

    mockedGet.mockResolvedValueOnce(mockResponse);

    const result = await fetchForecast(-12.04, -77.03);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2024-11-15");
    expect(mockedGet).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/forecast",
      expect.objectContaining({
        params: expect.objectContaining({ lat: -12.04, lon: -77.03, units: "metric" }),
      }),
    );
  });

  it("should throw WeatherServiceError on network failure", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"));

    try {
      await fetchForecast(0, 0);
      fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(WeatherServiceError);
      expect((err as WeatherServiceError).code).toBe("NETWORK_ERROR");
    }
  });
});

describe("getWeatherIconPath", () => {
  it("should return path for a valid day icon", () => {
    expect(getWeatherIconPath("01d")).toBe("/icons/01d.png");
    expect(getWeatherIconPath("10d")).toBe("/icons/10d.png");
  });

  it("should return path for a valid night icon", () => {
    expect(getWeatherIconPath("01n")).toBe("/icons/01n.png");
    expect(getWeatherIconPath("13n")).toBe("/icons/13n.png");
  });

  it("should fallback to unknown.png for invalid codes", () => {
    expect(getWeatherIconPath("99x")).toBe("/icons/unknown.png");
    expect(getWeatherIconPath("")).toBe("/icons/unknown.png");
  });
});
