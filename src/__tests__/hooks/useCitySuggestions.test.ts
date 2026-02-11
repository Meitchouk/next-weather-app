import { renderHook, act, waitFor } from "@testing-library/react";
import { useCitySuggestions } from "@/hooks/useCitySuggestions";
import * as weatherService from "@/services/weatherService";

jest.mock("@/services/weatherService", () => {
  const actual = jest.requireActual("@/services/weatherService");
  return {
    ...actual,
    fetchCitySuggestions: jest.fn(),
  };
});

const mockedFetch = weatherService.fetchCitySuggestions as jest.MockedFunction<
  typeof weatherService.fetchCitySuggestions
>;

describe("useCitySuggestions hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedFetch.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should start with empty suggestions", () => {
    const { result } = renderHook(() => useCitySuggestions());
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("should return empty for queries shorter than 2 chars", () => {
    const { result } = renderHook(() => useCitySuggestions());

    act(() => result.current.fetchSuggestions("a"));

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("should return empty for whitespace-only queries", () => {
    const { result } = renderHook(() => useCitySuggestions());

    act(() => result.current.fetchSuggestions("   "));

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("should fetch suggestions after debounce", async () => {
    const mockResults = [
      { name: "London", lat: 51.5, lon: -0.12, country: "GB", state: "England" },
    ];
    mockedFetch.mockResolvedValueOnce(mockResults);

    const { result } = renderHook(() => useCitySuggestions());

    act(() => result.current.fetchSuggestions("Lon"));

    expect(result.current.loading).toBe(true);

    // Advance past debounce
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual(mockResults);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle fetch errors gracefully (non-aborted)", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("Network failure"));

    const { result } = renderHook(() => useCitySuggestions());

    act(() => result.current.fetchSuggestions("Lon"));

    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should clear suggestions and cancel pending requests", async () => {
    mockedFetch.mockResolvedValueOnce([
      { name: "Paris", lat: 48.8, lon: 2.3, country: "FR" },
    ]);

    const { result } = renderHook(() => useCitySuggestions());

    act(() => result.current.fetchSuggestions("Par"));

    // Clear before debounce fires
    act(() => result.current.clearSuggestions());

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);

    // Advance timers — should not call fetch since timer was cleared
    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("should abort previous request on new fetch", async () => {
    mockedFetch.mockResolvedValue([{ name: "Lima", lat: -12.0, lon: -77.0, country: "PE" }]);

    const { result } = renderHook(() => useCitySuggestions());

    // Start first fetch
    act(() => result.current.fetchSuggestions("Lon"));

    // Start second fetch before debounce fires (replaces timer)
    act(() => result.current.fetchSuggestions("Lim"));

    await act(async () => {
      jest.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(result.current.suggestions).toEqual([
        { name: "Lima", lat: -12.0, lon: -77.0, country: "PE" },
      ]);
    });

    // Only one call should have been made (second timer replaced the first)
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("should clean up on unmount", () => {
    const { unmount } = renderHook(() => useCitySuggestions());
    // Should not throw
    unmount();
  });
});
