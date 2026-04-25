"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import FormField from "@/components/FormField/FormField";
import SelectField from "@/components/SelectField/SelectField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import Button from "@/components/Button/Button";
import type { SelectOption } from "@/app/types/component";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number;
  packageTitle: string;
  destinationSlug: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthOptions(): SelectOption[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    return { value, label };
  });
}

export function BookingModal({
  isOpen,
  onClose,
  packageId,
  packageTitle,
  destinationSlug,
}: BookingModalProps) {
  const [travelersCount, setTravelersCount] = useState("");
  const [preferredMonth, setPreferredMonth] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, error } = useCreateBooking();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Reset state after modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setTravelersCount("");
        setPreferredMonth("");
        setNotes("");
        setSubmitted(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const count = parseInt(travelersCount, 10);
    if (isNaN(count) || count < 1) return;

    mutate(
      {
        packageId,
        packageTitle,
        destinationSlug,
        travelersCount: count,
        preferredMonth,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${packageTitle}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg glass ghost-border shadow-lg shadow-primary/20 rounded-3xl p-8 flex flex-col gap-6">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-surface-high text-text-muted hover:text-text transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
            <div>
              <h2 className="text-headline-md text-text">Request received!</h2>
              <p className="text-body-md text-text-muted mt-2 max-w-sm">
                Our team will get in touch within 48 hours to tailor this trip
                to your needs.
              </p>
            </div>
            <Button variant="primary" onClick={onClose} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div>
              <h2 className="text-headline-md text-text">{packageTitle}</h2>
              <p className="text-body-md text-text-muted mt-2">
                Share your interest and our team will reach out to plan your
                perfect trip.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <FormField
                id="travelers"
                label="Number of travelers"
                type="number"
                required
                placeholder="e.g. 2"
                value={travelersCount}
                onChange={(e) => setTravelersCount(e.target.value)}
              />
              <SelectField
                id="preferredMonth"
                label="Preferred travel month"
                required
                placeholder="Select a month"
                options={getMonthOptions()}
                value={preferredMonth}
                onChange={(e) => setPreferredMonth(e.target.value)}
              />
              <TextAreaField
                id="notes"
                label="Additional notes"
                placeholder="Any special requests, dietary needs, anniversary celebrations…"
                rows={3}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              {error && (
                <p className="text-body-sm text-red-400">
                  {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="w-full justify-center mt-2"
              >
                {isPending ? "Submitting…" : "Express Interest"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
