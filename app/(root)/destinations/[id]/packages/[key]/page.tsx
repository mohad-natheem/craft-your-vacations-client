"use client";

import { use, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Clock,
  MapPin,
  ScrollText,
  Calendar,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePackageDetail } from "@/hooks/usePackageDetail";
import { useDestination } from "@/hooks/useDestination";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Section from "@/components/Section/Sections";
import PackageCard from "@/components/PackageCard/PackageCard";
import ItineraryDay from "@/components/ItineraryDay/ItineraryDay";
import BookingModal from "@/components/BookingModal/BookingModal";

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string; key: string }>;
}) {
  const { id, key } = use(params);
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);

  const {
    data: pkg,
    isLoading: pkgLoading,
    isError: pkgError,
    error: pkgErr,
    refetch: pkgRefetch,
  } = usePackageDetail(id, key);

  const { data: destination } = useDestination(id);

  if (pkgLoading) {
    return <LoadingSpinner message="Loading package..." fullScreen={false} />;
  }

  if (pkgError) {
    return (
      <ErrorState
        message={pkgErr instanceof Error ? pkgErr.message : undefined}
        onRetry={pkgRefetch}
      />
    );
  }

  if (!pkg) {
    return <ErrorState title="Package not found" />;
  }

  const totalActivities = pkg.itinerary.reduce(
    (sum, day) => sum + day.activities.length,
    0
  );

  const otherPackages =
    destination?.packages.filter((p) => p.key !== key) ?? [];

  return (
    <div className="section-gap">
      {/* ─── Hero ─── */}
      <div className="relative w-full h-(--hero-height-compact) min-h-120 overflow-hidden rounded-3xl mx-auto max-w-7xl px-6">
        {destination?.imagePath ? (
          <Image
            src={destination.imagePath}
            alt={destination.title}
            fill
            className="object-cover rounded-3xl"
            priority
          />
        ) : (
          <div className="absolute inset-0 rounded-3xl bg-surface-high" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-overlay/95 via-overlay/50 to-overlay/10" />
        <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-overlay/60 via-transparent to-transparent" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-on-overlay/70 hover:text-on-overlay text-label-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {destination?.title ?? "Back"}
        </button>

        {/* Bottom overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
          {/* Destination tag */}
          {destination && (
            <div className="flex items-center gap-1.5 mb-4">
              {destination.destinationCities.slice(0, 2).map((city) => (
                <span
                  key={city}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-on-overlay/10 backdrop-blur-sm border border-on-overlay/20 text-label-sm text-primary-app uppercase tracking-widest"
                >
                  <MapPin className="w-3 h-3" />
                  {city}
                </span>
              ))}
            </div>
          )}

          {/* Package title */}
          <h1 className="text-display-xl md:text-display-xxl text-on-overlay leading-hero mb-4">
            {pkg.title}
          </h1>

          <p className="text-body-lg text-on-overlay/70 mb-6 max-w-xl leading-relaxed">
            {pkg.excerpt}
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-on-overlay/10 backdrop-blur-md border border-on-overlay/15">
              <Clock className="w-4 h-4 text-primary-app" />
              <span className="text-on-overlay text-body-sm font-medium">
                {pkg.days} Days
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-on-overlay/10 backdrop-blur-md border border-on-overlay/15">
              <Zap className="w-4 h-4 text-primary-app" />
              <span className="text-on-overlay text-body-sm font-medium">
                {totalActivities} Activities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Overview ─── */}
      <Section id="overview" title="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: description */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="text-headline-lg text-text mb-3">
                About this package
              </h2>
              <p className="text-body-lg text-text-muted leading-relaxed">
                {pkg.excerpt}
              </p>
            </div>

            {/* Stat chips row */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-high border border-outline">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest">
                    Duration
                  </p>
                  <p className="text-body-md text-text font-medium">
                    {pkg.days} Days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-high border border-outline">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest">
                    Activities
                  </p>
                  <p className="text-body-md text-text font-medium">
                    {totalActivities} total
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-high border border-outline">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <ScrollText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest">
                    Itinerary
                  </p>
                  <p className="text-body-md text-text font-medium">
                    {pkg.itinerary.length} days planned
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Trip summary glass card */}
          <div className="glass rounded-2xl p-6 flex flex-col gap-5 h-fit">
            <h3 className="text-headline-sm text-text">Trip Summary</h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                    Duration
                  </p>
                  <p className="text-body-md text-text font-medium">
                    {pkg.days} days / {pkg.days - 1} nights
                  </p>
                </div>
              </div>

              {destination && (
                <>
                  <div className="h-px bg-outline" />
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                        Destination
                      </p>
                      <p className="text-body-md text-text font-medium">
                        {destination.title}
                      </p>
                      <p className="text-body-sm text-text-muted">
                        {destination.destinationCities.join(", ")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="w-full btn-gradient font-semibold py-3 rounded-2xl transition-opacity hover:opacity-90 mt-2"
            >
              Book This Package
            </button>
          </div>
        </div>
      </Section>

      {/* ─── Itinerary ─── */}
      <Section id="itinerary" title="">
        <div className="mb-8">
          <h2 className="text-headline-lg text-text">Day-by-Day Itinerary</h2>
          <p className="text-body-md text-text-muted mt-1">
            {pkg.days} days · {totalActivities} activities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sticky progress rail (desktop) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-5 gap-0">
            <div className="relative flex flex-col items-center h-full">
              <div className="absolute top-3 bottom-3 w-px bg-outline" />
              {pkg.itinerary.map((day, i) => (
                <div
                  key={day.dayNumber}
                  className="relative z-10 flex flex-col items-center"
                  style={{
                    marginTop: i === 0 ? 0 : `${100 / pkg.itinerary.length}%`,
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/15 border-2 border-primary/50 flex items-center justify-center text-primary text-label-sm font-bold">
                    {day.dayNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day accordion list */}
          <div className="lg:col-span-11 flex flex-col gap-3">
            {pkg.itinerary.map((day, index) => (
              <ItineraryDay
                key={day.dayNumber}
                dayNumber={day.dayNumber}
                title={day.title}
                activities={day.activities}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Other Packages ─── */}
      {otherPackages.length > 0 && (
        <Section id="other-packages" title="">
          <div className="mb-8">
            <h2 className="text-headline-lg text-text">
              More packages
              {destination ? ` for ${destination.title}` : ""}
            </h2>
            <p className="text-body-md text-text-muted mt-1">
              Explore other ways to experience this destination
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPackages.map((p, index) => (
              <PackageCard
                key={p.key}
                title={p.title}
                duration={`${p.days} Days`}
                href={`/destinations/${id}/packages/${p.key}`}
                features={[
                  {
                    icon: <Clock className="w-4 h-4" />,
                    text: `${p.days}-day itinerary`,
                  },
                  {
                    icon: <ScrollText className="w-4 h-4" />,
                    text: p.excerpt,
                  },
                ]}
                highlighted={index === Math.floor(otherPackages.length / 2)}
              />
            ))}
          </div>
        </Section>
      )}

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        packageId={pkg.id}
        packageTitle={pkg.title}
        destinationSlug={id}
      />
    </div>
  );
}
