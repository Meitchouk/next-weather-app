import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { Header } from "@/components/organisms/Header";

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["es", "en"], defaultLocale: "es" },
  usePathname: () => "/",
  useRouter: () => ({ replace: jest.fn() }),
}));

describe("Header component", () => {
  it("should render the title", () => {
    render(<Header />);
    expect(screen.getByText("Weather App")).toBeInTheDocument();
  });

  it("should render the theme toggle button", () => {
    render(<Header />);
    // ThemeToggle renders a disabled placeholder when mounted=false in JSDOM
    expect(screen.getByRole("button", { name: /modo oscuro/i })).toBeInTheDocument();
  });

  it("should render the language switcher", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /english/i })).toBeInTheDocument();
  });
});
