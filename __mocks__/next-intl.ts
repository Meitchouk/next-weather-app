// Global mock for next-intl (used by Jest via moduleNameMapper)
import messages from "../src/messages/es.json";

// Mutable locale for testing both branches
let _mockLocale = "es";

const useTranslations = (namespace?: string) => {
  const section = namespace
    ? (messages as Record<string, Record<string, string>>)[namespace]
    : messages;

  /**
   * Mock translation function.
   * Supports nested keys and simple {param} interpolation.
   */
  return (key: string, params?: Record<string, string>) => {
    const value = (section as Record<string, string>)?.[key] ?? key;
    if (params && typeof value === "string") {
      // Simple interpolation for {city} etc.
      return value.replace(/\{(\w+)\}/g, (_, k: string) => params[k] ?? `{${k}}`);
    }
    return value ?? key;
  };
};

const useLocale = () => _mockLocale;
const useMessages = () => messages;
const useNow = () => new Date();
const useTimeZone = () => "America/Bogota";
const useFormatter = () => ({});

const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => children;

export {
  useTranslations,
  useLocale,
  useMessages,
  useNow,
  useTimeZone,
  useFormatter,
  NextIntlClientProvider,
};

// Expose setter for tests that need to override the locale
export const __setMockLocale = (locale: string) => {
  _mockLocale = locale;
};
