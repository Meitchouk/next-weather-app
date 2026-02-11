"use client";

import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import { config } from "@/config";

export function ApiKeyWarning() {
  const t = useTranslations("apiKeyWarning");

  if (config.openWeather.apiKey) return null;

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1300,
        width: "100%",
      }}
    >
      <Alert
        severity="error"
        variant="filled"
        role="status"
        sx={{ borderRadius: 0, justifyContent: "center" }}
      >
        <AlertTitle sx={{ mb: 0 }}>
          {t("title")}
        </AlertTitle>
        {t("description")}
      </Alert>
    </Box>
  );
}
