import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { WeatherCard } from "@/components/organisms/WeatherCard";
import type { WeatherData } from "@/types";

// Mock next/image for JSDOM
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

const mockData: WeatherData = {
  city: "Bogotá",
  country: "CO",
  temperature: 18,
  feelsLike: 16,
  tempMin: 14,
  tempMax: 20,
  humidity: 72,
  pressure: 1013,
  description: "nubes dispersas",
  icon: "03d",
  windSpeed: 3.5,
  windDeg: 180,
  clouds: 40,
  visibility: 10000,
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: -18000,
  coord: { lat: 4.71, lon: -74.07 },
};

const defaultProps = {
  data: mockData,
  displayTemp: 18,
  displayTempMin: 14,
  displayTempMax: 20,
  unitSymbol: "°C",
  onToggleUnit: jest.fn(),
};

const user = userEvent.setup({ pointerEventsCheck: 0 });

describe("WeatherCard component", () => {
  it("should display the city name and country code", () => {
    render(<WeatherCard {...defaultProps} />);
    expect(screen.getByText("Bogotá")).toBeInTheDocument();
    expect(screen.getByText("CO")).toBeInTheDocument();
  });

  it("should display the temperature in Celsius", () => {
    render(<WeatherCard {...defaultProps} />);
    expect(screen.getByTestId("temperature")).toHaveTextContent("18°C");
  });

  it("should display temperature in Fahrenheit when unit is °F", () => {
    render(<WeatherCard {...defaultProps} displayTemp={64} displayTempMin={57} displayTempMax={68} unitSymbol="°F" />);
    expect(screen.getByTestId("temperature")).toHaveTextContent("64°F");
  });

  it("should display min and max temperatures", () => {
    render(<WeatherCard {...defaultProps} />);
    expect(screen.getByTestId("temp-min")).toHaveTextContent("Mín 14°C");
    expect(screen.getByTestId("temp-max")).toHaveTextContent("Máx 20°C");
  });

  it("should display the weather description", () => {
    render(<WeatherCard {...defaultProps} />);
    expect(screen.getByTestId("description")).toHaveTextContent("nubes dispersas");
  });

  it("should render the local weather icon", () => {
    render(<WeatherCard {...defaultProps} />);
    const img = screen.getByAltText("nubes dispersas");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icons/03d.png");
  });

  it("should display the current date", () => {
    render(<WeatherCard {...defaultProps} />);
    expect(screen.getByTestId("current-date")).toBeInTheDocument();
  });

  it("should have an accessible region role", () => {
    render(<WeatherCard {...defaultProps} />);
    expect(screen.getByRole("region", { name: /información del clima/i })).toBeInTheDocument();
  });

  it("should call onToggleUnit when the unit chip is clicked", async () => {
    const onToggle = jest.fn();
    render(<WeatherCard {...defaultProps} onToggleUnit={onToggle} />);

    const chip = screen.getByRole("button", { name: /cambiar a °f/i });
    await user.click(chip);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
