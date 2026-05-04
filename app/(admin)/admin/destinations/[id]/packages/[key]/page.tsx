"use client";

import { use, useEffect, useState } from "react";
import { useDestination } from "@/hooks/useDestination";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useUpdatePackage } from "@/hooks/useUpdatePackage";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import FormField from "@/components/FormField/FormField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import { Trash2 } from "lucide-react";
import type { ItineraryDay, Activity } from "@/app/types/api";
import AdminBackLink from "@/app/(admin)/components/AdminBackLink";
import { ACTIVITY_TYPES } from "@/lib/constants";

function emptyActivity(): Activity {
  return { time: "", description: "", type: "leisure" };
}

export default function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string; key: string }>;
}) {
  const { id: destSlug, key } = use(params);
  const { data: destination, isLoading: destLoading } = useDestination(destSlug);
  const { data: pkg, isLoading: pkgLoading, isError, error, refetch } = usePackageDetail(destSlug, key);
  const updatePackage = useUpdatePackage(destination?.id ?? 0, destSlug, key);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  useEffect(() => {
    if (pkg) {
      setTitle(pkg.title);
      setPrice(String(pkg.price));
      setDays(String(pkg.days));
      setExcerpt(pkg.excerpt);
      setItinerary(pkg.itinerary ?? []);
    }
  }, [pkg]);

  if (destLoading || pkgLoading)
    return <LoadingSpinner message="Loading package…" fullScreen={false} />;
  if (isError)
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );
  if (!pkg)
    return (
      <div className="p-8">
        <p className="text-body-md text-text-muted">Package not found.</p>
      </div>
    );

  function addDay() {
    setItinerary([
      ...itinerary,
      { dayNumber: itinerary.length + 1, title: "", activities: [emptyActivity()] },
    ]);
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
    setConfirmSaveOpen(true);
  }

  function handleConfirmSave() {
    updatePackage.mutate(
      { title, price: Number(price), days: Number(days), excerpt, itinerary },
      {
        onSuccess: () => {
          setConfirmSaveOpen(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        },
      }
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <AdminBackLink
        href={`/admin/destinations/${destSlug}`}
        label={`Back to ${destination?.title ?? "destination"}`}
      />

      <h1 className="text-display-sm text-text mb-2">{pkg.title}</h1>
      <p className="text-body-md text-text-muted mb-8">{destSlug} · {pkg.key}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic info */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-headline-sm text-text">Package Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="pkg-title"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FormField
              id="pkg-price"
              label="Price (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <FormField
              id="pkg-days"
              label="Days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <TextAreaField
            id="pkg-excerpt"
            label="Excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        {/* Itinerary editor */}
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
                      placeholder="Time"
                      className="w-24 shrink-0 bg-surface-highest border border-outline rounded-xl px-3 py-2 text-body-sm text-text focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      value={act.description}
                      onChange={(e) => updateActivity(dayIndex, actIndex, "description", e.target.value)}
                      placeholder="Description"
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
          <Button
            variant="primary"
            type="submit"
            disabled={
              !(
                title !== pkg.title ||
                price !== String(pkg.price) ||
                days !== String(pkg.days) ||
                excerpt !== pkg.excerpt ||
                JSON.stringify(itinerary) !== JSON.stringify(pkg.itinerary ?? [])
              ) || updatePackage.isPending
            }
          >
            Save Changes
          </Button>
          {saveSuccess && <span className="text-body-sm text-green-400">Saved successfully</span>}
          {updatePackage.error && (
            <span className="text-body-sm text-red-400">
              {updatePackage.error instanceof Error
                ? updatePackage.error.message
                : "Failed to save"}
            </span>
          )}
        </div>
      </form>

      <ConfirmDialog
        isOpen={confirmSaveOpen}
        title="Save package changes?"
        message="This will update the package details and itinerary visible on the public site."
        confirmLabel="Yes, save"
        variant="warning"
        isPending={updatePackage.isPending}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmSaveOpen(false)}
      />
    </div>
  );
}
