"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import CompressIcon from "@mui/icons-material/Compress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import CloudIcon from "@mui/icons-material/Cloud";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Typography } from "@/components/atoms";
import type { WeatherData } from "@/types";

interface WeatherDetailsProps {
  data: WeatherData;
  convertTemp: (celsius: number) => number;
  unitSymbol: string;
}

/** Formats a Unix timestamp + timezone offset to a local time string (HH:MM). */
function formatTime(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatVisibility(meters: number, kmLabel: string, mLabel: string): string {
  if (meters < 1000) return `${meters} ${mLabel}`;
  const km = meters / 1000;
  return km % 1 === 0 ? `${Math.round(km)} ${kmLabel}` : `${km.toFixed(1)} ${kmLabel}`;
}

interface DetailItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
}

function DetailRow({ item }: { item: DetailItem }) {
  return (
    <ListItem
      sx={{
        py: 1,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ListItemIcon sx={{ minWidth: "auto" }}>{item.icon}</ListItemIcon>
        <Typography variant="body2" color="text.secondary">
          {item.label}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body2" fontWeight="bold">
          {item.value}
        </Typography>
        {item.secondary && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            {item.secondary}
          </Typography>
        )}
      </Box>
    </ListItem>
  );
}

export function WeatherDetails({ data, convertTemp, unitSymbol }: WeatherDetailsProps) {
  const t = useTranslations("details");
  const [expanded, setExpanded] = useState(false);

  const { coreDetails, extraDetails } = useMemo(() => {
    const windDirs = [
      t("windN"), t("windNE"), t("windE"), t("windSE"),
      t("windS"), t("windSW"), t("windW"), t("windNW"),
    ];
    const windDir = windDirs[Math.round(data.windDeg / 45) % 8];
    const wu = t("windUnit");

    const core: DetailItem[] = [
      {
        icon: <ThermostatIcon color="error" />,
        label: t("feelsLike"),
        value: `${convertTemp(data.feelsLike)}${unitSymbol}`,
      },
      {
        icon: <AirIcon color="info" />,
        label: t("wind"),
        value: `${data.windSpeed} ${wu} ${windDir}`,
        secondary: data.windGust
          ? `${t("gusts")} ${data.windGust} ${wu}`
          : undefined,
      },
      {
        icon: <WaterDropIcon color="primary" />,
        label: t("humidity"),
        value: `${data.humidity}%`,
      },
      {
        icon: <CompressIcon color="action" />,
        label: t("pressure"),
        value: `${data.pressure} ${t("pressureUnit")}`,
      },
      {
        icon: <WbSunnyIcon sx={{ color: "orange" }} />,
        label: t("sunrise"),
        value: formatTime(data.sunrise, data.timezone),
      },
      {
        icon: <NightsStayIcon sx={{ color: "slateblue" }} />,
        label: t("sunset"),
        value: formatTime(data.sunset, data.timezone),
      },
    ];

    const extra: DetailItem[] = [
      {
        icon: <VisibilityIcon color="action" />,
        label: t("visibility"),
        value: formatVisibility(data.visibility, t("visibilityKm"), t("visibilityM")),
      },
      {
        icon: <CloudIcon color="action" />,
        label: t("clouds"),
        value: `${data.clouds}%`,
      },
    ];

    return { coreDetails: core, extraDetails: extra };
  }, [data, convertTemp, unitSymbol, t]);

  return (
    <Box
      sx={{
        width: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <List disablePadding>
        {coreDetails.map((item, index) => (
          <Box key={item.label}>
            {index > 0 && <Divider component="li" />}
            <DetailRow item={item} />
          </Box>
        ))}
      </List>

      <Collapse in={expanded}>
        <List disablePadding>
          {extraDetails.map((item) => (
            <Box key={item.label}>
              <Divider component="li" />
              <DetailRow item={item} />
            </Box>
          ))}
        </List>
      </Collapse>

      <Divider />
      <Box
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded(!expanded);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          py: 0.75,
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Typography variant="caption" color="primary">
          {expanded ? t("showLess") : t("showMore")}
        </Typography>
        {expanded ? (
          <ExpandLessIcon sx={{ fontSize: 16, color: "primary.main" }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16, color: "primary.main" }} />
        )}
      </Box>
    </Box>
  );
}