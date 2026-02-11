"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import { Typography } from "@/components/atoms";
import type { DailyForecast } from "@/types";
import { getWeatherIconPath } from "@/services";

interface ForecastCardProps {
  day: DailyForecast;
  convertTemp: (celsius: number) => number;
  unitSymbol: string;
}

export function ForecastCard({ day, convertTemp, unitSymbol }: ForecastCardProps) {
  const t = useTranslations("forecast");
  const tDays = useTranslations("days");

  const dayNames: Record<number, string> = {
    0: tDays("sunday"),
    1: tDays("monday"),
    2: tDays("tuesday"),
    3: tDays("wednesday"),
    4: tDays("thursday"),
    5: tDays("friday"),
    6: tDays("saturday"),
  };

  const iconPath = getWeatherIconPath(day.icon);
  const dayName = dayNames[day.dayOfWeek] ?? "";

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 110,
        flex: "1 1 0",
        borderRadius: 2,
        scrollSnapAlign: "start",
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 }, textAlign: "center" }}>
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ textTransform: "capitalize", display: "block", mb: 0.5 }}
        >
          {dayName}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          {day.date.slice(5)}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", my: 0.5 }}>
          <Image
            src={iconPath}
            alt={day.description}
            width={48}
            height={48}
            unoptimized
          />
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: "capitalize", display: "block", mb: 0.5 }}
        >
          {day.description}
        </Typography>

        <Typography variant="body2" fontWeight="bold">
          {convertTemp(day.tempMax)}{unitSymbol} / {convertTemp(day.tempMin)}{unitSymbol}
        </Typography>

        <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 0.5, opacity: 0.55 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <WaterDropIcon sx={{ fontSize: 14, color: "primary.main" }} />
            <Typography variant="caption" color="text.secondary">
              {day.pop}%
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <AirIcon sx={{ fontSize: 14, color: "info.main" }} />
            <Typography variant="caption" color="text.secondary">
              {day.windSpeed} {t("windUnit")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
