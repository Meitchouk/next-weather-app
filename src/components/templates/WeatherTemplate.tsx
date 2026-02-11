"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Fade from "@mui/material/Fade";
import { Header } from "@/components/organisms";
import {
  AutocompleteSearchBar,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  SearchHistory,
  ApiKeyWarning,
} from "@/components/molecules";
import { WeatherCard, WeatherDetails, ForecastSection } from "@/components/organisms";
import { useWeather, useSearchHistory, useTemperatureUnit } from "@/hooks";
import { useBreakpointContext } from "@/providers/BreakpointProvider";

interface WeatherResultsProps {
  data: ReturnType<typeof useWeather>["data"];
  status: ReturnType<typeof useWeather>["status"];
  error: ReturnType<typeof useWeather>["error"];
  forecast: ReturnType<typeof useWeather>["forecast"];
  convertTemp: ReturnType<typeof useTemperatureUnit>["convertTemp"];
  unitSymbol: ReturnType<typeof useTemperatureUnit>["unitSymbol"];
  toggleUnit: ReturnType<typeof useTemperatureUnit>["toggleUnit"];
}

function MobileLayout({
  data,
  status,
  error,
  forecast,
  convertTemp,
  unitSymbol,
  toggleUnit,
}: WeatherResultsProps) {
  return (
    <Box
      component="section"
      sx={{
        mt: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      {status === "idle" && <EmptyState />}
      {status === "loading" && <LoadingSpinner />}
      {status === "error" && error && <ErrorMessage message={error} />}
      {status === "success" && data && (
        <>
          <Grow in timeout={500}>
            <Box sx={{ width: "100%" }}>
              <WeatherCard
                data={data}
                displayTemp={convertTemp(data.temperature)}
                displayTempMin={convertTemp(data.tempMin)}
                displayTempMax={convertTemp(data.tempMax)}
                unitSymbol={unitSymbol}
                onToggleUnit={toggleUnit}
              />
            </Box>
          </Grow>

          {forecast.length > 0 && (
            <Fade in timeout={700}>
              <Box sx={{ width: "100%" }}>
                <ForecastSection
                  forecast={forecast}
                  convertTemp={convertTemp}
                  unitSymbol={unitSymbol}
                />
              </Box>
            </Fade>
          )}

          <Fade in timeout={900}>
            <Box sx={{ width: "100%" }}>
              <WeatherDetails
                data={data}
                convertTemp={convertTemp}
                unitSymbol={unitSymbol}
              />
            </Box>
          </Fade>
        </>
      )}
    </Box>
  );
}

function DesktopLayout({
  data,
  status,
  error,
  forecast,
  convertTemp,
  unitSymbol,
  toggleUnit,
}: WeatherResultsProps) {
  return (
    <Box
      component="section"
      sx={{
        mt: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {status === "idle" && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <EmptyState />
        </Box>
      )}
      {status === "loading" && <LoadingSpinner />}
      {status === "error" && error && <ErrorMessage message={error} />}
      {status === "success" && data && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Grow in timeout={500}>
              <Box>
                <WeatherCard
                  data={data}
                  displayTemp={convertTemp(data.temperature)}
                  displayTempMin={convertTemp(data.tempMin)}
                  displayTempMax={convertTemp(data.tempMax)}
                  unitSymbol={unitSymbol}
                  onToggleUnit={toggleUnit}
                />
              </Box>
            </Grow>

            {forecast.length > 0 && (
              <Fade in timeout={900}>
                <Box sx={{ mt: 3 }}>
                  <ForecastSection
                    forecast={forecast}
                    convertTemp={convertTemp}
                    unitSymbol={unitSymbol}
                  />
                </Box>
              </Fade>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Fade in timeout={700}>
              <Box>
                <WeatherDetails
                  data={data}
                  convertTemp={convertTemp}
                  unitSymbol={unitSymbol}
                />
              </Box>
            </Fade>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export function WeatherTemplate() {
  const { data, status, error, forecast, searchWeather } = useWeather();
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { unitSymbol, toggleUnit, convertTemp } = useTemperatureUnit();
  const { isSmallScreen } = useBreakpointContext();

  useEffect(() => {
    if (data) {
      addToHistory(data.city);
    }
  }, [data, addToHistory]);

  const resultsProps: WeatherResultsProps = {
    data,
    status,
    error,
    forecast,
    convertTemp,
    unitSymbol,
    toggleUnit,
  };

  const searchBar = (
    <AutocompleteSearchBar onSearch={searchWeather} isLoading={status === "loading"} />
  );

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ApiKeyWarning />
      <Container
        maxWidth={isSmallScreen ? "sm" : "lg"}
        disableGutters={!isSmallScreen}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Header searchSlot={isSmallScreen ? undefined : searchBar} />

        {isSmallScreen && (
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {searchBar}
          </Box>
        )}

        <SearchHistory history={history} onSelect={searchWeather} onClear={clearHistory} />

        {isSmallScreen ? (
          <MobileLayout {...resultsProps} />
        ) : (
          <DesktopLayout {...resultsProps} />
        )}
      </Container>
    </Box>
  );
}
