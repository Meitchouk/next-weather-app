import React from "react";
import { render, screen } from "@testing-library/react";
import { WeatherCard } from "@/components/WeatherCard";
import type { WeatherData } from "@/types";

const mockData: WeatherData = {
  city: "Bogotá",
  temperature: 18,
  humidity: 72,
  description: "nubes dispersas",
  icon: "03d",
};

describe("WeatherCard component", () => {
  it("should display the city name", () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText("Bogotá")).toBeInTheDocument();
  });

  it("should display the temperature in Celsius", () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByTestId("temperature")).toHaveTextContent("18°C");
  });

  it("should display the weather description", () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByTestId("description")).toHaveTextContent(
      "nubes dispersas"
    );
  });

  it("should display the humidity percentage", () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByTestId("humidity")).toHaveTextContent("Humedad: 72%");
  });

  it("should render the weather icon", () => {
    render(<WeatherCard data={mockData} />);
    const img = screen.getByAltText("nubes dispersas");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      "https://openweathermap.org/img/wn/03d@2x.png"
    );
  });

  it("should have an accessible region role", () => {
    render(<WeatherCard data={mockData} />);
    expect(
      screen.getByRole("region", { name: /información del clima/i })
    ).toBeInTheDocument();
  });
});
