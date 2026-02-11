import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { AutocompleteSearchBar } from "@/components/molecules/AutocompleteSearchBar";
import * as weatherService from "@/services/weatherService";

// Mock the fetchCitySuggestions function
jest.mock("@/services/weatherService", () => {
  const actual = jest.requireActual("@/services/weatherService");
  return {
    ...actual,
    fetchCitySuggestions: jest.fn().mockResolvedValue([]),
  };
});

const mockedSuggestions = weatherService.fetchCitySuggestions as jest.MockedFunction<
  typeof weatherService.fetchCitySuggestions
>;

const user = userEvent.setup({ pointerEventsCheck: 0 });

describe("AutocompleteSearchBar component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the search input", () => {
    render(<AutocompleteSearchBar onSearch={jest.fn()} isLoading={false} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should call onSearch when Enter is pressed with text", async () => {
    const onSearch = jest.fn();
    render(<AutocompleteSearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Madrid");
    await user.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledWith("Madrid");
  });

  it("should not call onSearch when Enter is pressed with empty input", async () => {
    const onSearch = jest.fn();
    render(<AutocompleteSearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{Enter}");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should display suggestions from the geocoding API", async () => {
    mockedSuggestions.mockResolvedValueOnce([
      { name: "London", lat: 51.5, lon: -0.12, country: "GB", state: "England" },
      { name: "Londonderry", lat: 55.0, lon: -7.3, country: "GB", state: "Northern Ireland" },
    ]);

    render(<AutocompleteSearchBar onSearch={jest.fn()} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Lon");

    await waitFor(
      () => {
        expect(screen.getByText("London")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(screen.getByText("Londonderry")).toBeInTheDocument();
  });

  it("should disable input when isLoading is true", () => {
    render(<AutocompleteSearchBar onSearch={jest.fn()} isLoading={true} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("should clear suggestions when input is cleared", async () => {
    mockedSuggestions.mockResolvedValueOnce([
      { name: "Tokyo", lat: 35.6, lon: 139.6, country: "JP" },
    ]);

    render(<AutocompleteSearchBar onSearch={jest.fn()} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Tok");

    await waitFor(
      () => {
        expect(screen.getByText("Tokyo")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Clear the input
    await user.clear(input);

    // Suggestions should be cleared
    await waitFor(() => {
      expect(screen.queryByText("Tokyo")).not.toBeInTheDocument();
    });
  });

  it("should display suggestion without state field", async () => {
    mockedSuggestions.mockResolvedValueOnce([
      { name: "Tokyo", lat: 35.6, lon: 139.6, country: "JP" },
    ]);

    render(<AutocompleteSearchBar onSearch={jest.fn()} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Tok");

    await waitFor(
      () => {
        expect(screen.getByText("Tokyo")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Should show country without state
    expect(screen.getByText("JP")).toBeInTheDocument();
  });

  it("should call onSearch when a suggestion is selected", async () => {
    mockedSuggestions.mockResolvedValueOnce([
      { name: "Paris", lat: 48.8, lon: 2.3, country: "FR", state: "Île-de-France" },
    ]);

    const onSearch = jest.fn();
    render(<AutocompleteSearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Par");

    await waitFor(
      () => {
        expect(screen.getByText("Paris")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Click on the suggestion
    await user.click(screen.getByText("Paris"));

    expect(onSearch).toHaveBeenCalledWith("Paris");
  });

  it("should trim whitespace from search input on Enter", async () => {
    const onSearch = jest.fn();
    render(<AutocompleteSearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "  Berlin  ");
    await user.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledWith("Berlin");
  });

  it("should not call onSearch when value is null", async () => {
    mockedSuggestions.mockResolvedValueOnce([
      { name: "Rome", lat: 41.9, lon: 12.5, country: "IT" },
    ]);

    const onSearch = jest.fn();
    render(<AutocompleteSearchBar onSearch={onSearch} isLoading={false} />);

    // Simulate selecting null (clearing the value)
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await user.click(input);
    await user.keyboard("{Escape}");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("should handle string suggestions (freeSolo mode)", async () => {
    const onSearch = jest.fn();
    render(<AutocompleteSearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "CustomCity");
    await user.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledWith("CustomCity");
  });
});
