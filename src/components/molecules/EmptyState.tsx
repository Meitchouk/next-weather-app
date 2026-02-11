"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { Typography } from "@/components/atoms";

export function EmptyState() {
  const t = useTranslations("emptyState");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        py: { xs: 4, md: 3 },
        opacity: 0.65,
      }}
    >
      <ThermostatIcon sx={{ fontSize: 48, color: "primary.main" }} />
      <Typography variant="h6" fontWeight="bold" textAlign="center">
        {t("title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {t("description")}
      </Typography>
    </Box>
  );
}
