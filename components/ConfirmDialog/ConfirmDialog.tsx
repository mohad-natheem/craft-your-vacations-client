"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/Button/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm modal-panel shadow-lg shadow-primary/20 rounded-3xl p-8 flex flex-col items-center gap-5 text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            variant === "danger" ? "bg-red-500/15" : "bg-primary/15"
          }`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${variant === "danger" ? "text-red-400" : "text-primary"}`}
            strokeWidth={1.5}
          />
        </div>

        <div>
          <h2 className="text-headline-md text-text">{title}</h2>
          <p className="text-body-md text-text-muted mt-2">{message}</p>
        </div>

        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "error" : "primary"}
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Please wait…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
