"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { lightTheme, darkTheme } from "@/theme";
import { BreakpointProvider } from "@/providers/BreakpointProvider";

// Helpers for useSyncExternalStore-based mount detection
const emptySubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

/**
 * Uses useSyncExternalStore to detect client mount without
 * triggering a cascading setState inside useEffect.
 * Server snapshot → false (lightTheme), client snapshot → true.
 */
function MuiThemeSyncProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getTrue, getFalse);

  const muiTheme = useMemo(
    () => (mounted && resolvedTheme === "dark" ? darkTheme : lightTheme),
    [mounted, resolvedTheme]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui", prepend: true }}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <MuiThemeSyncProvider>
          <BreakpointProvider>{children}</BreakpointProvider>
        </MuiThemeSyncProvider>
      </NextThemesProvider>
    </AppRouterCacheProvider>
  );
}
