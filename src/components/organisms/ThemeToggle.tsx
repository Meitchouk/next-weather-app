"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@/components/atoms";

// Helpers for useSyncExternalStore-based mount detection
const emptySubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

/**
 * Organism: Toggle button for dark/light mode.
 * Reads and sets the theme via next-themes.
 *
 * Uses useSyncExternalStore to detect client mount without
 * triggering a cascading setState inside useEffect.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const mounted = useSyncExternalStore(emptySubscribe, getTrue, getFalse);

  // Render a disabled placeholder on the server / first paint
  if (!mounted) {
    return (
      <IconButton disabled color="inherit" aria-label={t("toggleDark")}>
        <DarkModeIcon />
      </IconButton>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const label = isDark ? t("toggleLight") : t("toggleDark");

  return (
    <Tooltip title={label}>
      <IconButton onClick={handleToggle} aria-label={label} color="inherit">
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
