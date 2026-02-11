import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type ViewportSize = "mobile" | "tablet" | "desktop";

export interface BreakpointInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  viewport: ViewportSize;
  /** True when viewport < md (< 900 px) — useful for single-column switches. */
  isSmallScreen: boolean;
}

/**
 * SSR-safe: on the server all media queries return false → defaults to mobile.
 */
export function useBreakpoint(): BreakpointInfo {
  const theme = useTheme();

  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const isUpLg = useMediaQuery(theme.breakpoints.up("lg"));

  return useMemo<BreakpointInfo>(() => {
    const isMobile = !isUpSm;
    const isTablet = isUpSm && !isUpLg;
    const isDesktop = isUpLg;
    const isSmallScreen = !isUpMd;

    const viewport: ViewportSize = isDesktop
      ? "desktop"
      : isTablet
        ? "tablet"
        : "mobile";

    return { isMobile, isTablet, isDesktop, viewport, isSmallScreen };
  }, [isUpSm, isUpMd, isUpLg]);
}
