"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import FormField from "@/components/FormField/FormField";
import SelectField from "@/components/SelectField/SelectField";
import TextAreaField from "@/components/TextAreaField/TextAreaField";
import Button from "@/components/Button/Button";
import type { SelectOption } from "@/app/types/component";

export interface BookingSubmitData {
  travelersCount: number;
  preferredMonth: string;
  notes?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
  isPending: boolean;
  error: Error | null;
  onSubmit: (data: BookingSubmitData) => void;
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
  packageTitle,
  isPending,
  error,
  onSubmit,
}: BookingModalProps) {
  const [travelersCount, setTravelersCount] = useState("");
  const [preferredMonth, setPreferredMonth] = useState("");
  const [notes, setNotes] = useState("");

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setTravelersCount("");
        setPreferredMonth("");
        setNotes("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const count = parseInt(travelersCount, 10);
    if (isNaN(count) || count < 1) return;
    onSubmit({
      travelersCount: count,
      preferredMonth,
      notes: notes.trim() || undefined,
    });
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
      <div className="relative z-10 w-full max-w-lg modal-panel shadow-lg shadow-primary/20 rounded-3xl p-8 flex flex-col gap-6">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-surface-high text-text-muted hover:text-text transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

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
                {error.message || "Something went wrong. Please try again."}
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
      </div>
    </div>
  );
}

export default BookingModal;
