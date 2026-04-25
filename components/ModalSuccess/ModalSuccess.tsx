"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/Button/Button";

interface ModalSuccessProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function ModalSuccess({ isOpen, title, message, onClose }: ModalSuccessProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

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
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm modal-panel shadow-lg shadow-primary/20 rounded-3xl p-8 flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
        <div>
          <h2 className="text-headline-md text-text">{title}</h2>
          <p className="text-body-md text-text-muted mt-2">{message}</p>
        </div>
        <Button variant="primary" onClick={onClose} className="mt-2">
          Done
        </Button>
      </div>
    </div>
  );
}
