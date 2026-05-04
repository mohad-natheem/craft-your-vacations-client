"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Props {
  cities: string[];
  onChange: (cities: string[]) => void;
}

export default function CityTagInput({ cities, onChange }: Props) {
  const [cityInput, setCityInput] = useState("");

  function addCity() {
    const trimmed = cityInput.trim();
    if (trimmed && !cities.includes(trimmed)) {
      onChange([...cities, trimmed]);
      setCityInput("");
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCity())}
          placeholder="Add a city and press Enter"
          className="flex-1 bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={addCity}
          className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-high text-text-muted transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {cities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {cities.map((city) => (
            <span
              key={city}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm"
            >
              {city}
              <button
                type="button"
                onClick={() => onChange(cities.filter((c) => c !== city))}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
