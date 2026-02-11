import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  it("should render core detail items initially", () => {
    render(<WeatherDetails {...defaultProps} />);

    // Core items (visible by default)
    expect(screen.getByText("Sensación térmica")).toBeInTheDocument();
    expect(screen.getByText("Viento")).toBeInTheDocument();
    expect(screen.getByText("Humedad")).toBeInTheDocument();
    expect(screen.getByText("Presión")).toBeInTheDocument();
    expect(screen.getByText("Amanecer")).toBeInTheDocument();
    expect(screen.getByText("Atardecer")).toBeInTheDocument();

    // Should show "Ver más" button
    expect(screen.getByText("Ver más")).toBeInTheDocument();
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

  it("should display visibility in km when >= 1000m", async () => {
    const user = userEvent.setup();
    render(<WeatherDetails {...defaultProps} />);

    // Expand to see visibility
    const expandButton = screen.getByText("Ver más");
    await user.click(expandButton);

    expect(screen.getByText("8.5 km")).toBeInTheDocument();
  });

  it("should display visibility in meters when < 1000m", async () => {
    const user = userEvent.setup();
    render(
      <WeatherDetails {...defaultProps} data={{ ...mockData, visibility: 500 }} />,
    );

    // Expand to see visibility
    const expandButton = screen.getByText("Ver más");
    await user.click(expandButton);

    expect(screen.getByText("500 m")).toBeInTheDocument();
  });

  it("should display cloudiness percentage", async () => {
    const user = userEvent.setup();
    render(<WeatherDetails {...defaultProps} />);

    // Expand to see cloudiness
    const expandButton = screen.getByText("Ver más");
    await user.click(expandButton);

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

  it("should display wind without gusts when windGust is not provided", () => {
    render(
      <WeatherDetails
        {...defaultProps}
        data={{ ...mockData, windGust: undefined }}
      />,
    );
    expect(screen.getByText("3.5 m/s S")).toBeInTheDocument();
    expect(screen.queryByText(/ráfagas/)).not.toBeInTheDocument();
  });

  it("should show additional details when expand button is clicked", async () => {
    const user = userEvent.setup();
    render(<WeatherDetails {...defaultProps} />);

    // Initially should show "Ver más"
    expect(screen.getByText("Ver más")).toBeInTheDocument();

    // Click "Ver más" button
    const expandButton = screen.getByText("Ver más");
    await user.click(expandButton);

    // Now should show "Ver menos" and the extra items should be visible
    expect(screen.getByText("Ver menos")).toBeInTheDocument();
    expect(screen.getByText("Visibilidad")).toBeVisible();
    expect(screen.getByText("Nubosidad")).toBeVisible();
    expect(screen.getByText("8.5 km")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("should hide additional details when collapse button is clicked", async () => {
    const user = userEvent.setup();
    render(<WeatherDetails {...defaultProps} />);

    // Expand first
    const expandButton = screen.getByText("Ver más");
    await user.click(expandButton);

    expect(screen.getByText("Ver menos")).toBeInTheDocument();

    // Click "Ver menos" button
    const collapseButton = screen.getByText("Ver menos");
    await user.click(collapseButton);

    // Should show "Ver más" again
    expect(screen.getByText("Ver más")).toBeInTheDocument();
  });

  it("should format visibility as integer km when decimal is .0", async () => {
    const user = userEvent.setup();
    render(
      <WeatherDetails
        {...defaultProps}
        data={{ ...mockData, visibility: 10000 }}
      />,
    );

    // Expand to see visibility
    const expandButton = screen.getByText("Ver más");
    await user.click(expandButton);

    // Should be "10 km" not "10.0 km"
    expect(screen.getByText("10 km")).toBeInTheDocument();
  });

  it("should expand details when pressing Enter on expand button", async () => {
    const user = userEvent.setup();
    render(<WeatherDetails {...defaultProps} />);

    // Find the expand button (the wrapper Box with role="button")
    const expandButtons = screen.getAllByRole("button");
    const expandButton = expandButtons[expandButtons.length - 1]; // Last button is the expand/collapse toggle

    // Focus and press Enter
    expandButton.focus();
    await user.keyboard("{Enter}");

    // Should show extra details
    expect(screen.getByText("Ver menos")).toBeInTheDocument();
    expect(screen.getByText("Visibilidad")).toBeVisible();
  });

  it("should expand details when pressing Space on expand button", async () => {
    const user = userEvent.setup();
    render(<WeatherDetails {...defaultProps} />);

    // Find the expand button
    const expandButtons = screen.getAllByRole("button");
    const expandButton = expandButtons[expandButtons.length - 1];

    // Focus and press Space
    expandButton.focus();
    await user.keyboard(" ");

    // Should show extra details
    expect(screen.getByText("Ver menos")).toBeInTheDocument();
    expect(screen.getByText("Visibilidad")).toBeVisible();
  });

  it("should not respond to other keys on expand button", async () => {
    const user = userEvent.setup();
    render(<WeatherDetails {...defaultProps} />);

    // Find the expand button
    const expandButtons = screen.getAllByRole("button");
    const expandButton = expandButtons[expandButtons.length - 1];

    // Focus and press a non-relevant key
    expandButton.focus();
    await user.keyboard("x");

    // Should still show "Ver más" (not expanded)
    expect(screen.getByText("Ver más")).toBeInTheDocument();
  });
});
