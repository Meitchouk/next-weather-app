"use client";

import { useTranslations } from "next-intl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { Typography } from "@/components/atoms";
import type { WeatherData } from "@/types";

interface WeatherCardProps {
  data: WeatherData;
}

/**
 * Organism: Full weather information card.
 * Composes MUI Card + atoms to display all weather details.
 */
export function WeatherCard({ data }: WeatherCardProps) {
  const t = useTranslations("weather");
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <Card
      variant="outlined"
      role="region"
      aria-label={t("regionLabel")}
      sx={{ width: "100%", maxWidth: 480 }}
    >
      <CardContent>
        {/* City name */}
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          {data.city}
        </Typography>

        {/* Icon + temperature */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconUrl}
            alt={data.description}
            width={80}
            height={80}
          />
          <Typography
            variant="h3"
            fontWeight="extrabold"
            data-testid="temperature"
          >
            {data.temperature}{t("temperatureUnit")}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Details */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textTransform: "capitalize", mb: 1 }}
            data-testid="description"
          >
            {data.description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
            <WaterDropIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary" data-testid="humidity">
              {t("humidity")}: {data.humidity}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
