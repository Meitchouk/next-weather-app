import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "@/theme";

/**
 * Test utility: wraps component with required providers.
 * - MUI ThemeProvider (light theme)
 * - next-intl is globally mocked via __mocks__/next-intl.js
 * - next-themes is mocked per-test where needed
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  );
}

/**
 * Custom render that wraps the component in all providers.
 * Use this instead of `@testing-library/react`'s render in tests.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
// Override default render
export { renderWithProviders as render };
