import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/helpers/renderWithProviders";
import { LanguageSwitcher } from "@/components/organisms/LanguageSwitcher";

const user = userEvent.setup({ pointerEventsCheck: 0 });

const mockReplace = jest.fn();

declare module "next-intl" {
  export const __setMockLocale: (locale: string) => void;
}

// Access the mutable locale setter from the mock
import { __setMockLocale } from "next-intl";

jest.mock("next-intl", () => {
  let currentLocale = "es";
  return {
    ...jest.requireActual("next-intl"),
    useLocale: () => currentLocale,
    __setMockLocale: (locale: string) => {
      currentLocale = locale;
    },
  };
});

jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["es", "en"], defaultLocale: "es" },
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...props}>{children}</a>
  ),
  usePathname: () => "/",
  useRouter: () => ({ replace: mockReplace }),
  redirect: jest.fn(),
  getPathname: jest.fn(),
}));

describe("LanguageSwitcher", () => {
  afterEach(() => {
    jest.clearAllMocks();
    __setMockLocale("es");
  });

  it("should switch from es to en", async () => {
    __setMockLocale("es");
    render(<LanguageSwitcher />);
    await user.click(screen.getByRole("button"));
    expect(mockReplace).toHaveBeenCalledWith("/", { locale: "en" });
  });

  it("should switch from en to es", async () => {
    __setMockLocale("en");
    render(<LanguageSwitcher />);
    await user.click(screen.getByRole("button"));
    expect(mockReplace).toHaveBeenCalledWith("/", { locale: "es" });
  });
});
