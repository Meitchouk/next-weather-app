export const config = {
  openWeather: {
    apiKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ?? "",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
    forecastUrl: "https://api.openweathermap.org/data/2.5/forecast",
    geoUrl: "https://api.openweathermap.org/geo/1.0/direct",
  },
} as const;
