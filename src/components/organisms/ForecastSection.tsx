"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Typography } from "@/components/atoms";
import type { DailyForecast } from "@/types";
import { ForecastCard } from "./ForecastCard";

interface ForecastSectionProps {
  forecast: DailyForecast[];
  convertTemp: (celsius: number) => number;
  unitSymbol: string;
}

export function ForecastSection({ forecast, convertTemp, unitSymbol }: ForecastSectionProps) {
  const t = useTranslations("forecast");

  if (forecast.length === 0) return null;

  const displayForecast = forecast.slice(0, 5);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        {t("title")}
      </Typography>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          overflowX: "auto",
          pb: 1,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 3,
            backgroundColor: "action.disabled",
          },
        }}
      >
        {displayForecast.map((day) => (
          <ForecastCard
            key={day.date}
            day={day}
            convertTemp={convertTemp}
            unitSymbol={unitSymbol}
          />
        ))}
      </Stack>
    </Box>
  );
}
