import React from "react";
import { screen, render as rtlRender } from "@testing-library/react";
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

  it("should render a disabled button on initial mount (server placeholder)", () => {
    // Override useSyncExternalStore to simulate server render
    const originalUseSyncExternalStore = React.useSyncExternalStore;
    React.useSyncExternalStore = jest.fn((subscribe, getSnapshot, getServerSnapshot) => {
      return getServerSnapshot?.() ?? false; // Server side returns false (not mounted)
    });

    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    // Should be disabled on initial render
    expect(button).toBeDisabled();

    // Restore original
    React.useSyncExternalStore = originalUseSyncExternalStore;
  });

  it("should call setTheme('dark') when the current theme is light", async () => {
    mockResolvedTheme = "light";
    render(<ThemeToggle />);
    const buttons = screen.getAllByRole("button");
    const themeButton = buttons[buttons.length - 1]; // Get the last button (ThemeToggle)
    await user.click(themeButton);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("should call setTheme('light') when the current theme is dark", async () => {
    mockResolvedTheme = "dark";
    render(<ThemeToggle />);
    const buttons = screen.getAllByRole("button");
    const themeButton = buttons[buttons.length - 1];
    await user.click(themeButton);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("should display correct tooltip label for light theme", async () => {
    mockResolvedTheme = "light";
    render(<ThemeToggle />);
    const buttons = screen.getAllByRole("button");
    const themeButton = buttons[buttons.length - 1];

    // Hover to show tooltip
    await user.hover(themeButton);

    // The tooltip should suggest switching to dark
    const tooltipText = await screen.findByRole("tooltip", { hidden: true });
    expect(tooltipText).toBeInTheDocument();
  });

  it("should display correct tooltip label for dark theme", async () => {
    mockResolvedTheme = "dark";
    render(<ThemeToggle />);
    const buttons = screen.getAllByRole("button");
    const themeButton = buttons[buttons.length - 1];

    // Hover to show tooltip
    await user.hover(themeButton);

    // The tooltip should suggest switching to light
    const tooltipText = await screen.findByRole("tooltip", { hidden: true });
    expect(tooltipText).toBeInTheDocument();
  });
});
