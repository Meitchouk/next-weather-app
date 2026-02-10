import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { WeatherTemplate } from "@/components/templates/WeatherTemplate";
import * as weatherService from "@/services/weatherService";

// Mock the service module
jest.mock("@/services/weatherService");
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
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <a {...props}>{children}</a>,
  usePathname: () => "/",
  useRouter: () => ({ replace: jest.fn() }),
  redirect: jest.fn(),
  getPathname: jest.fn(),
}));

// MUI buttons set pointer-events:none in JSDOM — skip that check
const user = userEvent.setup({ pointerEventsCheck: 0 });

describe("WeatherTemplate — integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display weather data after a successful search", async () => {
    mockedFetch.mockResolvedValueOnce({
      city: "Lima",
      temperature: 25,
      humidity: 60,
      description: "cielo claro",
      icon: "01d",
    });

    render(<WeatherTemplate />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "Lima");
    await user.click(button);

    // Wait for the result
    await waitFor(() => {
      expect(screen.getByText("Lima")).toBeInTheDocument();
    });

    expect(screen.getByTestId("temperature")).toHaveTextContent("25°C");
    expect(screen.getByTestId("description")).toHaveTextContent("cielo claro");
    expect(screen.getByTestId("humidity")).toHaveTextContent("Humedad: 60%");
  });

  it("should display an error message when the city is not found", async () => {
    mockedFetch.mockRejectedValueOnce(
      new Error('No se encontró la ciudad "xyz". Verifica el nombre e intenta de nuevo.')
    );

    render(<WeatherTemplate />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "xyz");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /No se encontró la ciudad/
      );
    });

    // Weather card should NOT be visible
    expect(screen.queryByTestId("temperature")).not.toBeInTheDocument();
  });

  it("should show loading state while fetching", async () => {
    // Never-resolving promise to keep loading state
    mockedFetch.mockImplementation(
      () => new Promise(() => {})
    );

    render(<WeatherTemplate />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "Paris");
    await user.click(button);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/buscando/i)).toBeInTheDocument();
  });
});
