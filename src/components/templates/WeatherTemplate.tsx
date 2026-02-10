"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Header } from "@/components/organisms";
import { SearchBar, LoadingSpinner, ErrorMessage } from "@/components/molecules";
import { WeatherCard } from "@/components/organisms";
import { useWeather } from "@/hooks";

/**
 * Template: Full page layout for the weather search feature.
 *
 * Assembles Organisms + Molecules into a complete page structure.
 * Owns the business logic via the useWeather hook.
 */
export function WeatherTemplate() {
  const { data, status, error, searchWeather } = useWeather();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        py: 6,
      }}
    >
      <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Header />

        <SearchBar onSearch={searchWeather} isLoading={status === "loading"} />

        {/* Results */}
        <Box
          component="section"
          sx={{
            mt: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {status === "loading" && <LoadingSpinner />}
          {status === "error" && error && <ErrorMessage message={error} />}
          {status === "success" && data && <WeatherCard data={data} />}
        </Box>
      </Container>
    </Box>
  );
}
