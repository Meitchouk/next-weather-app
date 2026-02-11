import { renderHook, act } from "@testing-library/react";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";

describe("useTemperatureUnit hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should default to celsius", () => {
    const { result } = renderHook(() => useTemperatureUnit());
    expect(result.current.unit).toBe("celsius");
    expect(result.current.unitSymbol).toBe("°C");
  });

  it("should hydrate from localStorage on mount", () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    const { result } = renderHook(() => useTemperatureUnit());
    expect(result.current.unit).toBe("fahrenheit");
    expect(result.current.unitSymbol).toBe("°F");
  });

  it("should ignore invalid values in localStorage", () => {
    localStorage.setItem("temperatureUnit", "kelvin");
    const { result } = renderHook(() => useTemperatureUnit());
    expect(result.current.unit).toBe("celsius");
  });

  it("should handle localStorage.getItem throwing", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => useTemperatureUnit());
    expect(result.current.unit).toBe("celsius");
    jest.restoreAllMocks();
  });

  it("should toggle from celsius to fahrenheit", () => {
    const { result } = renderHook(() => useTemperatureUnit());
    act(() => result.current.toggleUnit());
    expect(result.current.unit).toBe("fahrenheit");
    expect(result.current.unitSymbol).toBe("°F");
    expect(localStorage.getItem("temperatureUnit")).toBe("fahrenheit");
  });

  it("should toggle from fahrenheit back to celsius", () => {
    localStorage.setItem("temperatureUnit", "fahrenheit");
    const { result } = renderHook(() => useTemperatureUnit());
    act(() => result.current.toggleUnit());
    expect(result.current.unit).toBe("celsius");
    expect(localStorage.getItem("temperatureUnit")).toBe("celsius");
  });

  it("should handle localStorage.setItem throwing during toggle", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    const { result } = renderHook(() => useTemperatureUnit());
    act(() => result.current.toggleUnit());
    // Should still toggle in-memory even if persist fails
    expect(result.current.unit).toBe("fahrenheit");
    jest.restoreAllMocks();
  });

  it("should convert celsius to fahrenheit correctly", () => {
    const { result } = renderHook(() => useTemperatureUnit());
    // In celsius mode, convertTemp returns the value as-is
    expect(result.current.convertTemp(25)).toBe(25);

    act(() => result.current.toggleUnit());
    // In fahrenheit mode, 25°C = 77°F
    expect(result.current.convertTemp(25)).toBe(77);
    // 0°C = 32°F
    expect(result.current.convertTemp(0)).toBe(32);
  });
});
