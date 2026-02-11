import React from "react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { ApiKeyWarning } from "@/components/molecules/ApiKeyWarning";

let mockApiKey = "";

jest.mock("@/config/env", () => ({
  get config() {
    return {
      openWeather: {
        apiKey: mockApiKey,
        baseUrl: "https://api.openweathermap.org/data/2.5/weather",
        forecastUrl: "https://api.openweathermap.org/data/2.5/forecast",
        geoUrl: "https://api.openweathermap.org/geo/1.0/direct",
      },
    };
  },
}));

describe("ApiKeyWarning component", () => {
  beforeEach(() => {
    mockApiKey = "";
  });

  it("should render the warning when API key is not configured", () => {
    mockApiKey = "";

    const { container } = render(<ApiKeyWarning />);
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
    expect(container).toHaveTextContent("NEXT_PUBLIC_OPENWEATHER_API_KEY no está configurada");
  });

  it("should not render when API key is configured", () => {
    mockApiKey = "test-key-123";

    const { container } = render(<ApiKeyWarning />);
    expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument();
  });
});
