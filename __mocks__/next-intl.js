// Global mock for next-intl (ESM not supported by Jest without extra config)
const React = require("react");

// Mutable locale for testing both branches
let _mockLocale = "es";

const useTranslations = (namespace) => {
    // Load the Spanish messages at test time
    const messages = require("../src/messages/es.json");
    const section = namespace ? messages[namespace] : messages;

    return (key, params) => {
        const value = section?.[key] ?? key;
        if (params && typeof value === "string") {
            // Simple interpolation for {city} etc.
            return value.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
        }
        return value ?? key;
    };
};

const useLocale = () => _mockLocale;
const useMessages = () => require("../src/messages/es.json");
const useNow = () => new Date();
const useTimeZone = () => "America/Bogota";
const useFormatter = () => ({});

const NextIntlClientProvider = ({ children }) => children;

module.exports = {
    useTranslations,
    useLocale,
    useMessages,
    useNow,
    useTimeZone,
    useFormatter,
    NextIntlClientProvider,
    // Expose setter for tests that need to override the locale
    __setMockLocale: (locale) => { _mockLocale = locale; },
};
