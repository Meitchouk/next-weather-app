import axios from "axios";
import { AxiosError, AxiosHeaders } from "axios";
import { fetchWeatherByCity } from "@/services/weatherService";

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
    },
  };
});

const mockedGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe("weatherService — fetchWeatherByCity", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return normalized weather data on a successful response", async () => {
    const mockApiResponse = {
      data: {
        name: "Madrid",
        main: { temp: 22.4, humidity: 55 },
        weather: [
          { id: 800, main: "Clear", description: "cielo claro", icon: "01d" },
        ],
        cod: 200,
      },
    };

    mockedGet.mockResolvedValueOnce(mockApiResponse);

    const result = await fetchWeatherByCity("Madrid");

    expect(result).toEqual({
      city: "Madrid",
      temperature: 22,
      humidity: 55,
      description: "cielo claro",
      icon: "01d",
    });

    expect(mockedGet).toHaveBeenCalledTimes(1);
    expect(mockedGet).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/weather",
      expect.objectContaining({
        params: expect.objectContaining({ q: "Madrid", units: "metric" }),
      })
    );
  });

  it("should throw a user-friendly error when the city is not found (404)", async () => {
    const error = new AxiosError(
      "Not Found",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 404,
        statusText: "Not Found",
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    );

    mockedGet.mockRejectedValueOnce(error);

    await expect(fetchWeatherByCity("CiudadInexistente123")).rejects.toThrow(
      /No se encontró la ciudad/
    );
  });

  it("should throw an error when the API key is invalid (401)", async () => {
    const error = new AxiosError(
      "Unauthorized",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 401,
        statusText: "Unauthorized",
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
      }
    );

    mockedGet.mockRejectedValueOnce(error);

    await expect(fetchWeatherByCity("Madrid")).rejects.toThrow(
      /API Key inválida/
    );
  });

  it("should throw an error when the city name is empty or whitespace", async () => {
    await expect(fetchWeatherByCity("")).rejects.toThrow(
      /ingresa el nombre de una ciudad/
    );
    await expect(fetchWeatherByCity("   ")).rejects.toThrow(
      /ingresa el nombre de una ciudad/
    );
  });

  it("should throw a generic error on network failure", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"));

    await expect(fetchWeatherByCity("Madrid")).rejects.toThrow(
      /error al obtener el clima/
    );
  });
});
