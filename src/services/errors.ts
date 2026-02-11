/**
 * Error codes decoupled from i18n — the UI maps codes to
 * locale-specific messages via `useTranslations("errors")`.
 */
export type WeatherErrorCode =
  | "EMPTY_CITY"
  | "CITY_NOT_FOUND"
  | "INVALID_API_KEY"
  | "NETWORK_ERROR";

export class WeatherServiceError extends Error {
  public readonly name = "WeatherServiceError";

  constructor(
    public readonly code: WeatherErrorCode,
    public readonly cityName?: string
  ) {
    super(code);
  }
}

export const errorCodeToKey: Record<WeatherErrorCode, string> = {
  EMPTY_CITY: "emptyCity",
  CITY_NOT_FOUND: "cityNotFound",
  INVALID_API_KEY: "invalidApiKey",
  NETWORK_ERROR: "generic",
};
