import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { ForecastSection } from "@/components/organisms/ForecastSection";
import type { DailyForecast } from "@/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

function buildForecastDay(overrides: Partial<DailyForecast> = {}): DailyForecast {
  return {
    date: "2024-11-15",
    dayOfWeek: 5,
    tempDay: 22,
    tempMin: 18,
    tempMax: 26,
    icon: "01d",
    description: "cielo claro",
    humidity: 55,
    windSpeed: 3,
    pop: 10,
    ...overrides,
  };
}

const defaultProps = {
  forecast: [
    buildForecastDay({ date: "2024-11-15", dayOfWeek: 5 }),
    buildForecastDay({ date: "2024-11-16", dayOfWeek: 6 }),
    buildForecastDay({ date: "2024-11-17", dayOfWeek: 0 }),
  ],
  convertTemp: (c: number) => c,
  unitSymbol: "°C",
};

describe("ForecastSection component", () => {
  it("should render the section title", () => {
    render(<ForecastSection {...defaultProps} />);
    expect(screen.getByText("Pronóstico de 5 días")).toBeInTheDocument();
  });

  it("should render a card for each forecast day", () => {
    render(<ForecastSection {...defaultProps} />);
    expect(screen.getByText("viernes")).toBeInTheDocument();
    expect(screen.getByText("sábado")).toBeInTheDocument();
    expect(screen.getByText("domingo")).toBeInTheDocument();
  });

  it("should render nothing when forecast is empty", () => {
    const { container } = render(
      <ForecastSection forecast={[]} convertTemp={(c) => c} unitSymbol="°C" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should display dates for each day", () => {
    render(<ForecastSection {...defaultProps} />);
    expect(screen.getByText("11-15")).toBeInTheDocument();
    expect(screen.getByText("11-16")).toBeInTheDocument();
    expect(screen.getByText("11-17")).toBeInTheDocument();
  });
});
