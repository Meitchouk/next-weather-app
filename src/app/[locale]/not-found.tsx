"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: 2,
      }}
    >
      <SentimentDissatisfiedIcon sx={{ fontSize: 72, color: "text.secondary" }} />
      <Typography variant="h4" fontWeight="bold">
        {t("code")}
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        {t("message")}
      </Typography>
    </Box>
  );
}
