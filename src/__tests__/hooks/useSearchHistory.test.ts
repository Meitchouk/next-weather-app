import { renderHook, act } from "@testing-library/react";
import { useSearchHistory } from "@/hooks/useSearchHistory";

describe("useSearchHistory hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should start with empty history", () => {
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });

  it("should hydrate from localStorage on mount", () => {
    localStorage.setItem("weatherSearchHistory", JSON.stringify(["Lima", "Madrid"]));
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual(["Lima", "Madrid"]);
  });

  it("should handle corrupted localStorage data", () => {
    localStorage.setItem("weatherSearchHistory", "not valid json{{{");
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
  });

  it("should handle localStorage.getItem throwing", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.history).toEqual([]);
    jest.restoreAllMocks();
  });

  it("should add a city to history", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addToHistory("Lima"));
    expect(result.current.history).toEqual(["Lima"]);
    expect(JSON.parse(localStorage.getItem("weatherSearchHistory")!)).toEqual(["Lima"]);
  });

  it("should de-duplicate cities (case-insensitive)", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addToHistory("Lima"));
    act(() => result.current.addToHistory("lima"));
    expect(result.current.history).toEqual(["lima"]);
  });

  it("should limit history to 5 entries", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addToHistory("A"));
    act(() => result.current.addToHistory("B"));
    act(() => result.current.addToHistory("C"));
    act(() => result.current.addToHistory("D"));
    act(() => result.current.addToHistory("E"));
    act(() => result.current.addToHistory("F"));
    expect(result.current.history).toHaveLength(5);
    expect(result.current.history[0]).toBe("F");
    expect(result.current.history).not.toContain("A");
  });

  it("should handle localStorage.setItem throwing during add", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addToHistory("Lima"));
    // In-memory state should still work
    expect(result.current.history).toEqual(["Lima"]);
    jest.restoreAllMocks();
  });

  it("should clear history", () => {
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addToHistory("Lima"));
    act(() => result.current.addToHistory("Madrid"));
    act(() => result.current.clearHistory());
    expect(result.current.history).toEqual([]);
    expect(localStorage.getItem("weatherSearchHistory")).toBeNull();
  });

  it("should handle localStorage.removeItem throwing during clear", () => {
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => useSearchHistory());
    act(() => result.current.addToHistory("Lima"));
    act(() => result.current.clearHistory());
    expect(result.current.history).toEqual([]);
    jest.restoreAllMocks();
  });
});
