"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n";
import Tooltip from "@mui/material/Tooltip";
import TranslateIcon from "@mui/icons-material/Translate";
import { IconButton } from "@/components/atoms";
import type { Locale } from "@/i18n";

/**
 * Organism: Toggles between available locales (es ↔ en).
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale: Locale = locale === "es" ? "en" : "es";

  const handleSwitch = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Tooltip title={t("switchTo")}>
      <IconButton onClick={handleSwitch} aria-label={t("switchTo")} color="inherit">
        <TranslateIcon />
      </IconButton>
    </Tooltip>
  );
}
