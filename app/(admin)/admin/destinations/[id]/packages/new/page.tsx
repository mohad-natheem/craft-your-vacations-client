"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useDestination } from "@/hooks/useDestination";
import { useCreatePackage } from "@/hooks/useCreatePackage";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import { Trash2 } from "lucide-react";
import type { ItineraryDay, Activity } from "@/app/types/api";
import AdminBackLink from "@/app/(admin)/components/AdminBackLink";
import { ACTIVITY_TYPES } from "@/lib/constants";

function emptyActivity(): Activity {
  return { time: "", description: "", type: "leisure" };
}

function emptyDay(dayNumber: number): ItineraryDay {
  return { dayNumber, title: "", activities: [emptyActivity()] };
}

export default function NewPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: destSlug } = use(params);
  const router = useRouter();
  const { data: destination, isLoading } = useDestination(destSlug);
  const createPackage = useCreatePackage(destination?.id ?? 0, destSlug);

  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([emptyDay(1)]);

  if (isLoading) return <LoadingSpinner message="Loading…" fullScreen={false} />;

  function addDay() {
    setItinerary([...itinerary, emptyDay(itinerary.length + 1)]);
  }

  function removeDay(index: number) {
    setItinerary(
      itinerary
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  }

  function updateDay(index: number, field: keyof ItineraryDay, value: unknown) {
    setItinerary(itinerary.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  }

  function addActivity(dayIndex: number) {
    setItinerary(
      itinerary.map((d, i) =>
        i === dayIndex ? { ...d, activities: [...d.activities, emptyActivity()] } : d
      )
    );
  }

  function removeActivity(dayIndex: number, actIndex: number) {
    setItinerary(
      itinerary.map((d, i) =>
        i === dayIndex
          ? { ...d, activities: d.activities.filter((_, ai) => ai !== actIndex) }
          : d
      )
    );
  }

  function updateActivity(
    dayIndex: number,
    actIndex: number,
    field: keyof Activity,
    value: string
  ) {
    setItinerary(
      itinerary.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              activities: d.activities.map((a, ai) =>
                ai === actIndex ? { ...a, [field]: value } : a
              ),
            }
          : d
      )
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createPackage.mutate(
      { key, title, price: Number(price), days: Number(days), excerpt, itinerary },
      {
        onSuccess: () => router.push(`/admin/destinations/${destSlug}`),
      }
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <AdminBackLink
        href={`/admin/destinations/${destSlug}`}
        label={`Back to ${destination?.title ?? "destination"}`}
      />

      <h1 className="text-display-sm text-text mb-8">New Package</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic info */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-headline-sm text-text">Package Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="pkg-title"
              label="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 7 Days Luxury"
            />

            <FormField
              id="pkg-key"
              label="Key (URL slug)"
              required
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="e.g. luxury-7d"
            />

            <FormField
              id="pkg-price"
              label="Price (₹)"
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 75000"
            />

            <FormField
              id="pkg-days"
              label="Days"
              required
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 7"
            />
          </div>

          <TextAreaField
            id="pkg-excerpt"
            label="Excerpt"
            required
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short description of this package…"
          />
        </div>

        {/* Itinerary */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-sm text-text">Itinerary</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addDay}>
              Add Day
            </Button>
          </div>

          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="glass rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-primary font-semibold uppercase tracking-widest">
                  Day {day.dayNumber}
                </span>
                {itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(dayIndex)}
                    className="text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <FormField
                id={`day-${dayIndex}-title`}
                label="Day Title"
                required
                value={day.title}
                onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                placeholder="e.g. Arrival & Check-in"
              />

              <div className="flex flex-col gap-3">
                <label className="text-label-md text-text-muted">Activities</label>
                {day.activities.map((act, actIndex) => (
                  <div key={actIndex} className="flex gap-2 items-start">
                    <input
                      value={act.time}
                      onChange={(e) => updateActivity(dayIndex, actIndex, "time", e.target.value)}
                      placeholder="Time (e.g. 09:00)"
                      className="w-24 shrink-0 bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      required
                      value={act.description}
                      onChange={(e) => updateActivity(dayIndex, actIndex, "description", e.target.value)}
                      placeholder="Activity description"
                      className="flex-1 bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <select
                      value={act.type}
                      onChange={(e) => updateActivity(dayIndex, actIndex, "type", e.target.value)}
                      className="w-32 shrink-0 bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {ACTIVITY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {day.activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActivity(dayIndex, actIndex)}
                        className="p-2 text-text-muted hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="text"
                  size="sm"
                  onClick={() => addActivity(dayIndex)}
                >
                  + Add activity
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="primary" type="submit" disabled={createPackage.isPending}>
            {createPackage.isPending ? "Creating…" : "Create Package"}
          </Button>
          {createPackage.error && (
            <span className="text-body-sm text-red-400">
              {createPackage.error instanceof Error
                ? createPackage.error.message
                : "Failed to create"}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
