"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Typography } from "@/components/atoms";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  searchSlot?: React.ReactNode;
}

export function Header({ searchSlot }: HeaderProps) {
  const t = useTranslations("header");

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: { xs: 1, md: 2 },
        mb: { xs: 1.5, md: 2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-start" },
          gap: 0.75,
          flexShrink: 0,
          width: { xs: "100%", md: "auto" },
        }}
      >
        <WbSunnyIcon sx={{ fontSize: { xs: 28, md: 24 }, color: "warning.main" }} />
        <Typography
          variant="h6"
          fontWeight="extrabold"
          sx={{ whiteSpace: "nowrap" }}
        >
          {t("title")}
        </Typography>
      </Box>

      {searchSlot && (
        <Box sx={{ flex: 1, width: "100%", maxWidth: { md: 520 } }}>
          {searchSlot}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexShrink: 0,
          order: { xs: -1, md: 0 },
          alignSelf: { xs: "flex-end", md: "center" },
        }}
      >
        <LanguageSwitcher />
        <ThemeToggle />
      </Box>
    </Box>
  );
}
