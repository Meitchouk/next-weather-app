"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Typography } from "@/components/atoms";
import type { WeatherData } from "@/types";
import { getWeatherIconPath } from "@/services";

interface WeatherCardProps {
  data: WeatherData;
  displayTemp: number;
  displayTempMin: number;
  displayTempMax: number;
  unitSymbol: string;
  onToggleUnit: () => void;
}

/** Formats the current date using the city's timezone offset. */
function formatCurrentDate(timezoneOffset: number, locale: string): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const local = new Date(utc + timezoneOffset * 1000);
  return local.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function WeatherCard({
  data,
  displayTemp,
  displayTempMin,
  displayTempMax,
  unitSymbol,
  onToggleUnit,
}: WeatherCardProps) {
  const t = useTranslations("weather");
  const tLang = useTranslations("language");
  const iconPath = getWeatherIconPath(data.icon);
  const currentLocale = tLang("code");

  const toggleLabel = unitSymbol === "°C" ? t("toggleToFahrenheit") : t("toggleToCelsius");
  const dateStr = formatCurrentDate(data.timezone, currentLocale);

  return (
    <Card
      variant="outlined"
      role="region"
      aria-label={t("regionLabel")}
      sx={{
        width: "100%",
        borderRadius: 3,
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {data.city}
          </Typography>
          <Chip
            label={data.country}
            size="small"
            variant="filled"
            color="default"
            sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
          />
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}
        >
          <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: "capitalize" }}
            data-testid="current-date"
          >
            {dateStr}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            my: 1,
          }}
        >
          <Image
            src={iconPath}
            alt={data.description}
            width={100}
            height={100}
            unoptimized
            data-testid="weather-icon"
          />
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography variant="h2" fontWeight="extrabold" data-testid="temperature">
              {displayTemp}
              {unitSymbol}
            </Typography>
            <Chip
              label={unitSymbol === "°C" ? "°F" : "°C"}
              size="small"
              variant="outlined"
              onClick={onToggleUnit}
              aria-label={toggleLabel}
              sx={{ cursor: "pointer", ml: 0.5 }}
            />
          </Box>
        </Box>

        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          sx={{ textTransform: "capitalize", mb: 1.5 }}
          data-testid="description"
        >
          {data.description}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        <Stack direction="row" justifyContent="center" spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ArrowDownwardIcon fontSize="small" color="info" />
            <Typography variant="body2" color="text.secondary" data-testid="temp-min">
              {t("min")} {displayTempMin}{unitSymbol}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ArrowUpwardIcon fontSize="small" color="error" />
            <Typography variant="body2" color="text.secondary" data-testid="temp-max">
              {t("max")} {displayTempMax}{unitSymbol}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
