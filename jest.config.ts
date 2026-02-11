import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  displayName: "weather-app",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^next-intl$": "<rootDir>/__mocks__/next-intl.ts",
    "^next-intl/(.*)$": "<rootDir>/__mocks__/next-intl.ts",
  },
  // Transform ESM packages that Jest can't parse out of the box
  transformIgnorePatterns: [
    "node_modules/(?!(next-intl|use-intl|@mui|@emotion|@babel)/)",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/helpers/",
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/**/layout.tsx",
    "!src/**/page.tsx",
    "!src/**/globals.css",
    "!src/i18n/**",
    "!src/providers/**",
    "!src/theme/**",
    "!src/config/**",
    "!src/proxy.ts",
    "!src/app/**/loading.tsx",
    "!src/app/**/error.tsx",
    "!src/app/**/not-found.tsx",
    "!src/__tests__/**",
    "!src/lib/**",
  ],
};

export default createJestConfig(config);
