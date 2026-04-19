"use client";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import ErrorState from "@/components/ErrorState/ErrorState";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Section from "@/components/Section/Sections";
import { useDestinations } from "@/hooks/useDestinations";

export function DestinationsScreen() {
  const { data, isLoading, isError, error, refetch } = useDestinations();

  if (isLoading) {
    return <LoadingSpinner message="Loading destinations..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  }

  if (!data || data.length === 0) {
    return <ErrorState title="No destinations found" />;
  }

  return (
    <div>
      <Section id="destinations" title="All Destinations">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {data.map((destination, index) => {
            const className = index % 2 !== 0 ? "pt-12" : "";
            return (
              <div className={className} key={destination.id}>
                <DestinationCard
                  href="/"
                  key={destination.id}
                  imagePath={destination.imagePath}
                  title={destination.title}
                  destinationCities={destination.detailJson.destinationCities}
                  content={destination.content}
                />
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

export default DestinationsScreen;
