"use client";
import Button from "@/components/Button/Button";
import Section from "@/components/Section/Sections";
import { Loader, LucideArrowRightCircle } from "lucide-react";
import Image from "next/image";
import IntroIcon1 from "@/public/introImage1.jpg";
import IntroIcon5 from "@/public/introImage5.jpg";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import { useDestinations } from "@/hooks/useDestinations";

export default function HomePage() {
  const { data, isLoading } = useDestinations();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="no-scrollbar overflow-y-auto">
      <section className="relative h-230.25 pl-6 md:pl-30 flex items-center overflow-hidden bg-surface-low mb-16">
        <div className="z-10 max-w-3xl">
          <span className="label text-primary font-bold tracking-[0.2em] mb-6 block uppercase text-label-sm">
            Elevate Your Perspective
          </span>
          <h1 className="text-display-xl md:text-display-xxl text-text tracking-tighter leading-[0.9] mb-8">
            Explore the <br />
            <span className="text-primary italic">Extraordinary</span>
          </h1>
          <p className="text-text-muted text-xl max-w-xl mb-10 leading-relaxed font-light">
            Bespoke journeys curated for the discerning traveler. From the
            silence of Nordic fjords to the vibrant pulse of tropical
            archipelagos.
          </p>
          <div className="flex gap-4">
            <Button>Begin Your Story</Button>
            <Button variant="secondary">
              View Collections
              <LucideArrowRightCircle />
            </Button>
          </div>
        </div>
        <div className="absolute right-[-5%] top-[10%] w-1/2 h-[80%] z-0 hidden lg:block">
          <div className="relative w-full h-full">
            <div className="absolute top-0 right-0 w-4/5 h-[85%] rounded-3xl overflow-hidden shadow-2xl z-20">
              <Image src={IntroIcon1} fill objectFit="cover" alt="Intro icon" />
            </div>
            <div className="absolute bottom-0 left-0 w-3/5 h-[50%] rounded-3xl overflow-hidden shadow-2xl z-30 border-8 border-white">
              <Image src={IntroIcon5} alt="Intro icon" />
            </div>
          </div>
        </div>
      </section>
      <section
        id={"curateddestinations"}
        className="section-gap border-t border-outline"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-row items-center justify-between mb-16">
            <div className="flex flex-col gap-4">
              <span className="text-headline-lg text-primary-dark">
                Curated Destinations
              </span>
              <span className="text-text-muted max-w-md">
                Our signature selection of locations where luxury meets untamed
                nature.
              </span>
            </div>
            <div>
              <Button href="/destinations" variant="text">
                View all
              </Button>
            </div>
          </div>

          <div className="flex gap-20 overflow-x-auto pb-10 no-scrollbar">
            {/* {data &&
              data.slice(0, 5).map((destination, index) => {
                const className = index % 2 !== 0 ? "pt-12" : "";
                return (
                  <div key={index} className={className}>
                    <DestinationCard
                      href="/"
                      className={"w-60 md:w-80"}
                      key={destination.id}
                      imagePath={destination.imagePath}
                      title={destination.title}
                      destinationCities={
                        destination.detailJson.destinationCities
                      }
                      content={destination.content}
                    />
                  </div>
                );
              })
              } */}
          </div>
        </div>
      </section>
    </div>
  );
}
