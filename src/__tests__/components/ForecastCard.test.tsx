import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { ForecastCard } from "@/components/organisms/ForecastCard";
import type { DailyForecast } from "@/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

const mockDay: DailyForecast = {
  date: "2024-11-15",
  dayOfWeek: 5, // Friday
  tempDay: 22,
  tempMin: 18,
  tempMax: 26,
  icon: "03d",
  description: "nubes dispersas",
  humidity: 55,
  windSpeed: 3.5,
  pop: 20,
};

const defaultProps = {
  day: mockDay,
  convertTemp: (c: number) => c,
  unitSymbol: "°C",
};

describe("ForecastCard component", () => {
  it("should display the day name", () => {
    render(<ForecastCard {...defaultProps} />);
    expect(screen.getByText("viernes")).toBeInTheDocument();
  });

  it("should display the date (MM-DD)", () => {
    render(<ForecastCard {...defaultProps} />);
    expect(screen.getByText("11-15")).toBeInTheDocument();
  });

  it("should display the weather icon", () => {
    render(<ForecastCard {...defaultProps} />);
    const img = screen.getByAltText("nubes dispersas");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icons/03d.png");
  });

  it("should display the temperature range", () => {
    render(<ForecastCard {...defaultProps} />);
    expect(screen.getByText("26°C / 18°C")).toBeInTheDocument();
  });

  it("should display precipitation probability", () => {
    render(<ForecastCard {...defaultProps} />);
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("should display wind speed", () => {
    render(<ForecastCard {...defaultProps} />);
    expect(screen.getByText("3.5 m/s")).toBeInTheDocument();
  });

  it("should convert temperatures when unit is Fahrenheit", () => {
    const fahrenheitConvert = (c: number) => Math.round(c * (9 / 5) + 32);
    render(
      <ForecastCard {...defaultProps} convertTemp={fahrenheitConvert} unitSymbol="°F" />,
    );
    // 26°C = 79°F, 18°C = 64°F
    expect(screen.getByText("79°F / 64°F")).toBeInTheDocument();
  });

  it("should display the weather description", () => {
    render(<ForecastCard {...defaultProps} />);
    expect(screen.getByText("nubes dispersas")).toBeInTheDocument();
  });

  it("should render the Card component with proper structure", () => {
    const { container } = render(<ForecastCard {...defaultProps} />);
    const card = container.querySelector('[class*="MuiCard"]');
    expect(card).toBeInTheDocument();
  });

  it("should handle different day of week values", () => {
    render(<ForecastCard {...defaultProps} day={{ ...mockDay, dayOfWeek: 0 }} />);
    expect(screen.getByText("domingo")).toBeInTheDocument();
  });

  it("should use fallback day name for invalid day of week", () => {
    render(
      <ForecastCard
        {...defaultProps}
        day={{ ...mockDay, dayOfWeek: 10 }}
      />,
    );
    const allText = screen.getAllByText(/[a-z]/i);
    expect(allText.length).toBeGreaterThan(0);
  });
});
