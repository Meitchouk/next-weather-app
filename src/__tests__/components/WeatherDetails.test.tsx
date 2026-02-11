import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { WeatherDetails } from "@/components/organisms/WeatherDetails";
import type { WeatherData } from "@/types";

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
  windGust: 5.1,
  clouds: 40,
  visibility: 8500,
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: -18000,
  coord: { lat: 4.71, lon: -74.07 },
};

const defaultProps = {
  data: mockData,
  convertTemp: (c: number) => c,
  unitSymbol: "°C",
};

describe("WeatherDetails component", () => {
  it("should render all 8 detail cards", () => {
    render(<WeatherDetails {...defaultProps} />);

    expect(screen.getByText("Sensación térmica")).toBeInTheDocument();
    expect(screen.getByText("Viento")).toBeInTheDocument();
    expect(screen.getByText("Humedad")).toBeInTheDocument();
    expect(screen.getByText("Presión")).toBeInTheDocument();
    expect(screen.getByText("Visibilidad")).toBeInTheDocument();
    expect(screen.getByText("Nubosidad")).toBeInTheDocument();
    expect(screen.getByText("Amanecer")).toBeInTheDocument();
    expect(screen.getByText("Atardecer")).toBeInTheDocument();
  });

  it("should display feels like temperature with correct unit", () => {
    render(<WeatherDetails {...defaultProps} />);
    expect(screen.getByText("16°C")).toBeInTheDocument();
  });

  it("should display wind speed with direction and gusts", () => {
    render(<WeatherDetails {...defaultProps} />);
    expect(screen.getByText("3.5 m/s S")).toBeInTheDocument();
    expect(screen.getByText("ráfagas 5.1 m/s")).toBeInTheDocument();
  });

  it("should display humidity percentage", () => {
    render(<WeatherDetails {...defaultProps} />);
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("should display pressure in hPa", () => {
    render(<WeatherDetails {...defaultProps} />);
    expect(screen.getByText("1013 hPa")).toBeInTheDocument();
  });

  it("should display visibility in km when >= 1000m", () => {
    render(<WeatherDetails {...defaultProps} />);
    expect(screen.getByText("8.5 km")).toBeInTheDocument();
  });

  it("should display visibility in meters when < 1000m", () => {
    render(
      <WeatherDetails {...defaultProps} data={{ ...mockData, visibility: 500 }} />,
    );
    expect(screen.getByText("500 m")).toBeInTheDocument();
  });

  it("should display cloudiness percentage", () => {
    render(<WeatherDetails {...defaultProps} />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("should convert temperature when unit is Fahrenheit", () => {
    const fahrenheitConvert = (c: number) => Math.round(c * (9 / 5) + 32);
    render(
      <WeatherDetails
        {...defaultProps}
        convertTemp={fahrenheitConvert}
        unitSymbol="°F"
      />,
    );
    // feelsLike = 16°C → 61°F
    expect(screen.getByText("61°F")).toBeInTheDocument();
  });
});
