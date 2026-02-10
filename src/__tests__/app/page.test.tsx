import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "@/app/page";
import * as weatherService from "@/services/weatherService";

// Mock the service module
jest.mock("@/services/weatherService");
const mockedFetch = weatherService.fetchWeatherByCity as jest.MockedFunction<
  typeof weatherService.fetchWeatherByCity
>;

describe("HomePage — integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display weather data after a successful search", async () => {
    const user = userEvent.setup();

    mockedFetch.mockResolvedValueOnce({
      city: "Lima",
      temperature: 25,
      humidity: 60,
      description: "cielo claro",
      icon: "01d",
    });

    render(<HomePage />);

    const input = screen.getByLabelText(/nombre de la ciudad/i);
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
    const user = userEvent.setup();

    mockedFetch.mockRejectedValueOnce(
      new Error('No se encontró la ciudad "xyz". Verifica el nombre e intenta de nuevo.')
    );

    render(<HomePage />);

    const input = screen.getByLabelText(/nombre de la ciudad/i);
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
    const user = userEvent.setup();

    // Never-resolving promise to keep loading state
    mockedFetch.mockImplementation(
      () => new Promise(() => {})
    );

    render(<HomePage />);

    const input = screen.getByLabelText(/nombre de la ciudad/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "Paris");
    await user.click(button);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/buscando/i)).toBeInTheDocument();
  });
});
