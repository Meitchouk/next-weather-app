"use client";

import { useState, type SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Typography } from "@/components/atoms";
import type { GeocodingResult } from "@/types";
import { useCitySuggestions } from "@/hooks";

interface AutocompleteSearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function AutocompleteSearchBar({ onSearch, isLoading }: AutocompleteSearchBarProps) {
  const t = useTranslations("search");
  const { suggestions, loading: suggestionsLoading, fetchSuggestions, clearSuggestions } =
    useCitySuggestions();
  const [inputValue, setInputValue] = useState("");

  const getOptionLabel = (option: GeocodingResult | string): string => {
    if (typeof option === "string") return option;
    const parts = [option.name];
    if (option.state) parts.push(option.state);
    parts.push(option.country);
    return parts.join(", ");
  };

  const handleChange = (_event: SyntheticEvent, value: GeocodingResult | string | null) => {
    if (!value) return;
    const cityName = typeof value === "string" ? value : value.name;
    if (cityName.trim()) {
      onSearch(cityName.trim());
      clearSuggestions();
    }
  };

  const handleInputChange = (_event: SyntheticEvent, value: string, reason: string) => {
    setInputValue(value);
    if (reason === "input") {
      fetchSuggestions(value);
    } else if (reason === "clear") {
      clearSuggestions();
    }
  };

  return (
    <Autocomplete<GeocodingResult | string, false, false, true>
      freeSolo
      disabled={isLoading}
      options={suggestions}
      getOptionLabel={getOptionLabel}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      loading={suggestionsLoading}
      filterOptions={(x) => x} // Don't filter client-side, API already does
      noOptionsText={t("noResults")}
      loadingText={t("loadingSuggestions")}
      sx={{ width: "100%", maxWidth: { xs: 480 } }}
      slotProps={{
        paper: {
          elevation: 4,
          sx: { borderRadius: 2, mt: 0.5 },
        },
      }}
      renderOption={(props, option) => {
        if (typeof option === "string") return <li {...props}>{option}</li>;
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
        return (
          <li key={key} {...rest}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {[option.state, option.country].filter(Boolean).join(", ")}
                </Typography>
              </Box>
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("placeholder")}
          aria-label={t("inputLabel")}
          size="small"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {(suggestionsLoading || isLoading) && (
                    <CircularProgress color="inherit" size={18} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
