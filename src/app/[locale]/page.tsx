"use client";

import { WeatherTemplate } from "@/components/templates";

/**
 * Page component — delegates everything to the template.
 * This keeps the App Router page thin and focused on routing/metadata only.
 */
export default function HomePage() {
  return <WeatherTemplate />;
}
