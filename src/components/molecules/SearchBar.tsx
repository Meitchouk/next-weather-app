"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "@/components/atoms";
import { Button } from "@/components/atoms";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

/**
 * Molecule: Search input + submit button.
 * Composes Atoms (Input, Button) and integrates i18n.
 */
export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const t = useTranslations("search");
  const [city, setCity] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 1.5, width: "100%", maxWidth: 480 }}
    >
      <Input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("inputLabel")}
        disabled={isLoading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        size="small"
      />
      <Button
        type="submit"
        disabled={isLoading || !city.trim()}
        aria-label={t("buttonAriaLabel")}
        sx={{ px: 3, whiteSpace: "nowrap" }}
      >
        {isLoading ? t("buttonLoading") : t("button")}
      </Button>
    </Box>
  );
}
