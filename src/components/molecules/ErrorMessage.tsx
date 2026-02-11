"use client";

import { useTranslations } from "next-intl";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const t = useTranslations("errors");

  return (
    <Alert severity="error" variant="outlined" role="alert" sx={{ width: "100%" }}>
      <AlertTitle>{t("title")}</AlertTitle>
      {message}
    </Alert>
  );
}
