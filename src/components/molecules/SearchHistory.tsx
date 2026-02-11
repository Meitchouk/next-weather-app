"use client";

import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@/components/atoms";

interface SearchHistoryProps {
  history: string[];
  onSelect: (city: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  const t = useTranslations("history");

  if (history.length === 0) return null;

  return (
    <Box sx={{ width: "100%", maxWidth: { xs: 480, md: "none" }, mt: 0.75 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
        <HistoryIcon sx={{ fontSize: 16 }} color="action" />
        <Typography variant="caption" color="text.secondary">
          {t("title")}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mx: 0.25 }}>
          ·
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          onClick={onClear}
          sx={{
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {t("clear")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          overflowX: "auto",
          pb: 0.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {history.map((city) => (
          <Chip
            key={city}
            label={city}
            size="small"
            onClick={() => onSelect(city)}
            clickable
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
}
