"use client";

import { use } from "react";
import Image from "next/image";
import {
  MapPin,
  DollarSign,
  Package,
  Clock,
  ScrollText,
  ChevronLeft,
} from "lucide-react";
import { useDestination } from "@/hooks/useDestination";
import { useDestinations } from "@/hooks/useDestinations";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Section from "@/components/Section/Sections";
import PackageCard from "@/components/PackageCard/PackageCard";
import DestinationLandscapeCard from "@/components/DestinationLandscapeCard/DestinationLandscapeCard";
import { useRouter } from "next/navigation";

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error, refetch } = useDestination(id);
  const { data: allDestinations } = useDestinations();
  const router = useRouter();

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading destination..." fullScreen={false} />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return <ErrorState title="Destination not found" />;
  }

  const {
    title,
    imagePath,
    content,
    packages,
    destinationCities,
    minPackagePrice,
  } = data;

  const popularDestinations =
    allDestinations?.filter((d) => d.slug !== id).slice(0, 4) ?? [];

  return (
    <div className="section-gap">
      {/* Hero */}
      <div className="relative w-full h-(--hero-height) min-h-130 overflow-hidden rounded-3xl mx-auto max-w-7xl px-6">
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover rounded-3xl"
          priority
        />

        {/* Layered gradients for depth */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-overlay/90 via-overlay/40 to-overlay/10" />
        <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-overlay/50 via-transparent to-transparent" />

        {/* Breadcrumb */}
        <div
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-on-overlay/70 hover:text-on-overlay text-label-sm transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Destinations
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
          {/* City tags */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {destinationCities?.map((city) => (
              <span
                key={city}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-overlay/10 backdrop-blur-sm border border-on-overlay/20 text-label-sm text-primary-app uppercase tracking-widest"
              >
                <MapPin className="w-3 h-3" />
                {city}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-display-xl md:text-display-xxl text-on-overlay leading-hero mb-8">
            {title}
          </h1>

          {/* Stat chips row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-on-overlay/10 backdrop-blur-md border border-on-overlay/15">
              <DollarSign className="w-4 h-4 text-primary-app" />
              <span className="text-on-overlay text-body-sm font-medium">
                From ${minPackagePrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-on-overlay/10 backdrop-blur-md border border-on-overlay/15">
              <Package className="w-4 h-4 text-primary-app" />
              <span className="text-on-overlay text-body-sm font-medium">
                {packages.length} Packages
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-on-overlay/10 backdrop-blur-md border border-on-overlay/15">
              <Clock className="w-4 h-4 text-primary-app" />
              <span className="text-on-overlay text-body-sm font-medium">
                {Math.min(...packages.map((p) => p.days))}–
                {Math.max(...packages.map((p) => p.days))} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <Section id="destination-info" title="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Content */}
          <div className="lg:col-span-2">
            <h2 className="text-headline-lg text-text mb-4">
              About this destination
            </h2>
            <p className="text-body-lg text-text-muted leading-relaxed">
              {content}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-col gap-4">
            <div className="glass rounded-2xl p-6 flex flex-col gap-5">
              <h3 className="text-headline-sm text-text">At a glance</h3>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                    Cities
                  </p>
                  <p className="text-body-md text-text">
                    {destinationCities.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                    Starting from
                  </p>
                  <p className="text-body-md text-text">
                    ${minPackagePrice.toLocaleString()}{" "}
                    <span className="text-text-muted text-body-sm">
                      per person
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-text-muted uppercase tracking-widest mb-0.5">
                    Packages
                  </p>
                  <p className="text-body-md text-text">
                    {packages.length} available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Packages */}
      {packages.length > 0 && (
        <Section id="packages" title="">
          <div className="mb-8">
            <h2 className="text-headline-lg text-text">Available packages</h2>
            <p className="text-body-md text-text-muted mt-1">
              Choose the journey that fits your style
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <PackageCard
                key={pkg.key}
                title={pkg.title}
                duration={`${pkg.days} Days`}
                price={`$${pkg.price.toLocaleString()}`}
                priceLabel="per person"
                href={`/destinations/${id}/packages/${pkg.key}`}
                features={[
                  {
                    icon: <Clock className="w-4 h-4" />,
                    text: `${pkg.days}-day itinerary`,
                  },
                  {
                    icon: <ScrollText className="w-4 h-4" />,
                    text: pkg.excerpt,
                  },
                ]}
                highlighted={index === Math.floor(packages.length / 2)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Popular Destinations */}
      {popularDestinations.length > 0 && (
        <Section id="popular-destinations" title="">
          <div className="mb-8">
            <h2 className="text-headline-lg text-text">
              Explore more destinations
            </h2>
            <p className="text-body-md text-text-muted mt-1">
              Continue your journey somewhere new
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {popularDestinations.map((destination, index) => (
              <DestinationLandscapeCard
                key={destination.id}
                href={`/destinations/${destination.slug}`}
                panelLeft={index % 2 === 0}
                imagePath={destination.imagePath}
                title={destination.title}
                destinationCities={destination.destinationCities}
                content={destination.content}
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
