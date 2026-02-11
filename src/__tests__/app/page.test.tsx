import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { WeatherTemplate } from "@/components/templates/WeatherTemplate";
import * as weatherService from "@/services/weatherService";

// Mock the service module — partial mock to preserve WeatherServiceError class
jest.mock("@/services/weatherService", () => {
  const actual = jest.requireActual("@/services/weatherService");
  return {
    ...actual,
    fetchWeatherByCity: jest.fn(),
    fetchForecast: jest.fn().mockResolvedValue([]),
    fetchCitySuggestions: jest.fn().mockResolvedValue([]),
  };
});
const mockedFetch = weatherService.fetchWeatherByCity as jest.MockedFunction<
  typeof weatherService.fetchWeatherByCity
>;

// Mock next-themes (ThemeToggle uses useTheme)
jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next-intl navigation (LanguageSwitcher uses it)
jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["es", "en"], defaultLocale: "es" },
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...props}>{children}</a>
  ),
  usePathname: () => "/",
  useRouter: () => ({ replace: jest.fn() }),
  redirect: jest.fn(),
  getPathname: jest.fn(),
}));

// Mock next/image for JSDOM (renders as plain <img>)
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

/** Helper: builds a complete WeatherData mock */
function buildWeatherData(overrides?: Partial<weatherService.default>) {
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

// MUI buttons set pointer-events:none in JSDOM — skip that check
const user = userEvent.setup({ pointerEventsCheck: 0 });

describe("WeatherTemplate — integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display weather data after a successful search", async () => {
    mockedFetch.mockResolvedValueOnce(buildWeatherData());

    render(<WeatherTemplate />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lima");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByTestId("temperature")).toBeInTheDocument();
    });

    expect(screen.getByTestId("temperature")).toHaveTextContent("25°C");
    expect(screen.getByTestId("description")).toHaveTextContent("cielo claro");
    // Min/Max shown in redesigned card
    expect(screen.getByTestId("temp-min")).toHaveTextContent("Mín 22°C");
    expect(screen.getByTestId("temp-max")).toHaveTextContent("Máx 28°C");
  });

  it("should display an error message when the service throws", async () => {
    mockedFetch.mockRejectedValueOnce(
      new weatherService.WeatherServiceError("CITY_NOT_FOUND", "xyz"),
    );

    render(<WeatherTemplate />);

    const input = screen.getByRole("combobox");
    await user.type(input, "xyz");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/No se encontró la ciudad/);
    });

    // Weather card should NOT be visible
    expect(screen.queryByTestId("temperature")).not.toBeInTheDocument();
  });

  it("should show empty state on initial load", () => {
    render(<WeatherTemplate />);
    expect(screen.getByText("¿Qué clima hace hoy?")).toBeInTheDocument();
  });

  it("should display weather details grid after successful search", async () => {
    mockedFetch.mockResolvedValueOnce(buildWeatherData({ windSpeed: 5.2, humidity: 72 }));

    render(<WeatherTemplate />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lima");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Sensación térmica")).toBeInTheDocument();
    });

    expect(screen.getByText("Viento")).toBeInTheDocument();
    expect(screen.getByText("Humedad")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("Presión")).toBeInTheDocument();
    expect(screen.getByText("Visibilidad")).toBeInTheDocument();
    expect(screen.getByText("Amanecer")).toBeInTheDocument();
    expect(screen.getByText("Atardecer")).toBeInTheDocument();
  });
});
