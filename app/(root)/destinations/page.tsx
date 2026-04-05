"use client";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import Section from "@/components/Section/Sections";
import { useDestinations } from "@/hooks/useDestinations";

export function DestinationsScreen() {
  const { data, isLoading, isError, error } = useDestinations();

  if (!data) {
    return <div>Data is undefined</div>;
  }

  if (isLoading) {
    return <div className="">Loading...</div>;
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
