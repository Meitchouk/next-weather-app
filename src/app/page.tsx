"use client";

import { SearchBar, WeatherCard, ErrorMessage, LoadingSpinner } from "@/components";
import { useWeather } from "@/hooks";

/**
 * Home page — acts as the container component.
 *
 * Orchestrates the hook (business logic) and presentational components.
 * Follows the Container / Presentational pattern:
 *   - This component owns state via useWeather.
 *   - Child components are purely presentational (props in, JSX out).
 */
export default function HomePage() {
  const { data, status, error, searchWeather } = useWeather();

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-100 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          🌤️ Weather App
        </h1>
        <p className="text-gray-500 text-lg">
          Busca el clima actual de cualquier ciudad del mundo
        </p>
      </header>

      {/* Search */}
      <SearchBar onSearch={searchWeather} isLoading={status === "loading"} />

      {/* Results area */}
      <section className="mt-8 w-full flex flex-col items-center gap-4">
        {status === "loading" && <LoadingSpinner />}
        {status === "error" && error && <ErrorMessage message={error} />}
        {status === "success" && data && <WeatherCard data={data} />}
      </section>
    </main>
  );
}
