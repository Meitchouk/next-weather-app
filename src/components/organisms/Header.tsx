"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Typography } from "@/components/atoms";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Organism: App header with title, theme toggle and language switcher.
 */
export function Header() {
  const t = useTranslations("header");

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        maxWidth: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
        gap: 1,
      }}
    >
      {/* Controls row */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <LanguageSwitcher />
        <ThemeToggle />
      </Box>

      {/* Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WbSunnyIcon sx={{ fontSize: 40, color: "warning.main" }} />
        <Typography variant="h4" fontWeight="extrabold">
          {t("title")}
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" textAlign="center">
        {t("subtitle")}
      </Typography>
    </Box>
  );
}
