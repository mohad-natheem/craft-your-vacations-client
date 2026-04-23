import React from "react";
import type { PackageCardData } from "@/app/types/component";
import { Button } from "../Button/Button";

interface PackageCardProps extends PackageCardData {
  highlighted?: boolean;
  className?: string;
}

export function PackageCard({
  title,
  duration,
  price,
  priceLabel = "per person",
  features,
  ctaLabel = "Book Now",
  onCtaClick,
  highlighted = false,
  className = "",
}: PackageCardProps) {
  return (
    <div
      className={`flex flex-col gap-6 rounded-2xl p-6 transition-all ${
        highlighted
          ? "bg-surface-high border border-primary shadow-ambient"
          : "bg-surface border-b-4 border-primary/20 hover:border-primary"
      } ${className}`}
    >
      {highlighted && (
        <div className="self-start px-3 py-1 rounded-full bg-primary/20 text-primary text-label-sm">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div>
        <h3 className="text-headline-md text-text">{title}</h3>
        <p className="text-body-sm text-text-muted mt-1">{duration}</p>
      </div>

      {/* Price */}
      <div>
        <span className="text-display-sm text-primary">{price}</span>
        <span className="text-body-sm text-text-muted ml-2">{priceLabel}</span>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-3">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-body-md text-text-muted"
          >
            <span className="text-primary shrink-0">{feature.icon}</span>
            {feature.text}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={highlighted ? "primary" : "secondary"}
        onClick={onCtaClick}
        className="w-full justify-center mt-auto"
      >
        {ctaLabel}
      </Button>
    </div>
  );
}

export default PackageCard;
