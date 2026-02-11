"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Button } from "@/components/atoms";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Alert
        severity="error"
        variant="outlined"
        sx={{ maxWidth: 480, width: "100%" }}
        action={
          <Button onClick={reset} size="small" variant="outlined" color="error">
            {t("retry")}
          </Button>
        }
      >
        <AlertTitle>{t("title")}</AlertTitle>
        {t("description")}
        {process.env.NODE_ENV === "development" && (
          <Box component="pre" sx={{ mt: 1, fontSize: "0.75rem", opacity: 0.7 }}>
            {error.message}
          </Box>
        )}
      </Alert>
    </Box>
  );
}
