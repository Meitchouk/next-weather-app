"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export function LoadingSpinner() {
  const t = useTranslations("loading");

  return (
    <Box
      role="status"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <CircularProgress size={40} />
      <span className="sr-only">{t("label")}</span>
    </Box>
  );
}
