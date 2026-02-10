import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { ThemeToggle } from "@/components/organisms/ThemeToggle";

const user = userEvent.setup({ pointerEventsCheck: 0 });

const mockSetTheme = jest.fn();
let mockResolvedTheme = "light";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  afterEach(() => jest.clearAllMocks());

  it("should call setTheme('dark') when the current theme is light", async () => {
    mockResolvedTheme = "light";
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("should call setTheme('light') when the current theme is dark", async () => {
    mockResolvedTheme = "dark";
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button"));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
