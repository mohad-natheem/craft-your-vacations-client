"use client";

import { useState, useEffect, useRef } from "react";

interface AutoSliderProps {
  children: React.ReactNode[];
  visibleCount?: number;
  intervalMs?: number;
  className?: string;
}

export default function AutoSlider({
  children,
  visibleCount = 1,
  intervalMs = 4000,
  className = "",
}: AutoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPaused = useRef(false);
  const total = children.length;

  const maxIndex = Math.max(0, total - visibleCount);

  useEffect(() => {
    if (total <= visibleCount) return;

    const timer = setInterval(() => {
      if (!isPaused.current) {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [total, visibleCount, intervalMs, maxIndex]);

  const itemWidthPercent = 100 / visibleCount;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      {/* overflow-hidden is on the inner wrapper; py-4 px-1 give shadows
          room to render before being clipped at the padding edge */}
      <div className="overflow-hidden py-4 px-1">
        {/* Track */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / total}%)`,
            width: `${(total / visibleCount) * 100}%`,
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              style={{ width: `${itemWidthPercent / (total / visibleCount)}%` }}
              className="px-3 box-border"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {total > visibleCount && (
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === currentIndex
                  ? "bg-primary"
                  : "bg-text-subtle hover:bg-text-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
