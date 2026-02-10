"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

/**
 * Presentational component: search input + button.
 * Delegates the search action upward via callback prop.
 */
export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [city, setCity] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ingresa el nombre de una ciudad..."
        aria-label="Nombre de la ciudad"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent text-gray-800 bg-white 
                   placeholder-gray-400 shadow-sm"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !city.trim()}
        aria-label="Buscar clima"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg 
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-colors shadow-sm cursor-pointer"
      >
        {isLoading ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
}
