import Image from "next/image";
import { ChevronLeft, MapPin } from "lucide-react";

export interface HeroChip {
  icon: React.ReactNode;
  label: string;
}

interface PageHeroProps {
  /** Background image URL. If omitted, a solid surface fallback is shown. */
  imagePath?: string;
  imageAlt?: string;
  title: string;
  /** Optional subtitle shown between the title and stat chips (e.g. package excerpt). */
  subtitle?: string;
  /** City / location tag pills shown above the title. */
  tags?: string[];
  /** Stat chips shown below the title (e.g. "12 Packages", "5–10 Days"). */
  chips?: HeroChip[];
  /** Label shown next to the back chevron. */
  backLabel: string;
  onBack: () => void;
  /** Use the compact hero height (for nested pages like package detail). */
  compact?: boolean;
  className?: string;
}

export default function PageHero({
  imagePath,
  imageAlt = "",
  title,
  subtitle,
  tags,
  chips,
  backLabel,
  onBack,
  className = "",
}: PageHeroProps) {
  return (
    <div
      className={`relative w-full shadow-lg shadow-primary/20 h-(--hero-height) min-h-130 overflow-hidden rounded-3xl mx-auto max-w-7xl px-6 ${className}`}
    >
      {/* Background image or fallback */}
      {imagePath ? (
        <Image
          src={imagePath}
          alt={imageAlt}
          fill
          className="object-cover rounded-3xl"
          priority
        />
      ) : (
        <div className="absolute inset-0 rounded-3xl bg-surface-high" />
      )}

      {/* Layered gradients for depth */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-overlay/90 via-overlay/50 to-overlay/10" />
      <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-overlay/55 via-transparent to-transparent" />

      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-on-overlay/70 hover:text-on-overlay text-label-sm transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </button>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
        {/* Location tag pills */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-overlay/10 backdrop-blur-sm border border-on-overlay/20 text-label-sm text-primary-app uppercase tracking-widest"
              >
                <MapPin className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-display-xl md:text-display-xxl text-on-overlay leading-hero mb-4">
          {title}
        </h1>

        {/* Optional subtitle */}
        {subtitle && (
          <p className="text-body-lg text-on-overlay/70 mb-6 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Stat chips */}
        {chips && chips.length > 0 && (
          <div className={`flex flex-wrap gap-3 ${subtitle ? "" : "mt-4"}`}>
            {chips.map((chip, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-on-overlay/10 backdrop-blur-md border border-on-overlay/15"
              >
                <span className="text-primary-app w-4 h-4 flex items-center justify-center">
                  {chip.icon}
                </span>
                <span className="text-on-overlay text-body-sm font-medium">
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
