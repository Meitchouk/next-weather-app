import type { WeatherData } from "@/types";

interface WeatherCardProps {
  data: WeatherData;
}

/**
 * Presentational component that displays weather information.
 * Receives data as props — no internal state or side effects.
 */
export function WeatherCard({ data }: WeatherCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <div
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 
                 border border-gray-100 animate-fade-in"
      role="region"
      aria-label="Información del clima"
    >
      {/* City name */}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        {data.city}
      </h2>

      {/* Icon + temperature */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconUrl}
          alt={data.description}
          width={80}
          height={80}
          className="drop-shadow-md"
        />
        <span
          className="text-5xl font-extrabold text-gray-900"
          data-testid="temperature"
        >
          {data.temperature}°C
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-center">
        <p className="text-lg text-gray-600 capitalize" data-testid="description">
          {data.description}
        </p>
        <p className="text-md text-gray-500" data-testid="humidity">
          💧 Humedad: {data.humidity}%
        </p>
      </div>
    </div>
  );
}
