// Components Demo Page
"use client";

import { Navbar } from "@/components/Navbar/NavBar";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ColorPalette } from "@/components/ColorPalette/ColorPalette";
import { TypographyShowcase } from "@/components/TypographyShowcase/TypographyShowcase";
import { Button } from "@/components/Button/Button";
import { FormField } from "@/components/FormField/FormField";
import { SelectField } from "@/components/SelectField/SelectField";
import { TextAreaField } from "@/components/TextAreaField/TextAreaField";
import { DestinationCard } from "@/components/DestinationCard/DestinationCard";
import { PackageCard } from "@/components/PackageCard/PackageCard";
import { TestimonialCard } from "@/components/TestimonialCard/TestimonialCard";
import { Footer } from "@/components/Footer/Footer";
import { FAB } from "@/components/FAB/FAB";
import { ArrowUp, MapPin } from "lucide-react";
import { Search } from "lucide-react";

/* ─── demo data ──────────────────────────────────────────────────────────── */

const destinations = [
  {
    imageUrl: "https://picsum.photos/seed/santorini/600/800",
    imageAlt: "Santorini at sunset",
    region: "Europe",
    title: "Santorini, Greece",
    description:
      "Whitewashed villages perched above the caldera, fiery sunsets and sapphire waters await.",
    href: "#",
  },
  {
    imageUrl: "https://picsum.photos/seed/kyoto/600/800",
    imageAlt: "Kyoto temple gardens",
    region: "Asia",
    title: "Kyoto, Japan",
    description:
      "Ancient temples, zen gardens and cherry-blossom avenues in Japan's cultural heartland.",
    href: "#",
  },
  {
    imageUrl: "https://picsum.photos/seed/patagonia/600/800",
    imageAlt: "Patagonia mountains",
    region: "South America",
    title: "Patagonia, Chile",
    description:
      "Dramatic granite towers, glaciers and untamed wilderness at the end of the world.",
    href: "#",
  },
];

const packages = [
  {
    title: "Explorer",
    duration: "7 days · 6 nights",
    price: "$1,299",
    features: [
      { icon: "flight", text: "Return flights included" },
      { icon: "hotel", text: "3-star accommodation" },
      { icon: "directions_bus", text: "Airport transfers" },
      { icon: "map", text: "Guided city tour" },
    ],
    ctaLabel: "Book Explorer",
  },
  {
    title: "Voyager",
    duration: "10 days · 9 nights",
    price: "$2,499",
    features: [
      { icon: "flight", text: "Business class flights" },
      { icon: "hotel", text: "5-star accommodation" },
      { icon: "directions_car", text: "Private transfers" },
      { icon: "tour", text: "3 guided excursions" },
      { icon: "restaurant", text: "Daily breakfast + 2 dinners" },
    ],
    ctaLabel: "Book Voyager",
  },
  {
    title: "Luminary",
    duration: "14 days · 13 nights",
    price: "$4,899",
    features: [
      { icon: "flight", text: "First class flights" },
      { icon: "villa", text: "Private villa or suite" },
      { icon: "local_activity", text: "Dedicated concierge" },
      { icon: "spa", text: "Spa & wellness access" },
      { icon: "restaurant", text: "All meals included" },
    ],
    ctaLabel: "Book Luminary",
  },
];

const testimonials = [
  {
    quote:
      "Every detail was flawlessly arranged. CraftVacations turned our anniversary trip into something truly magical — we still talk about it every day.",
    authorName: "Sofia Reyes",
    authorTitle: "Product Designer, Barcelona",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=5",
    authorAvatarAlt: "Sofia Reyes",
  },
  {
    quote:
      "I've travelled to 40+ countries but nothing compares to having a team that genuinely understands what you're looking for. Absolutely world-class.",
    authorName: "James Thornton",
    authorTitle: "Tech Entrepreneur, London",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=12",
    authorAvatarAlt: "James Thornton",
  },
  {
    quote:
      "The Patagonia expedition was breathtaking. The local guides they connected us with had knowledge you simply can't find in any guidebook.",
    authorName: "Aiko Nakamura",
    authorTitle: "Photographer, Tokyo",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=47",
    authorAvatarAlt: "Aiko Nakamura",
  },
];

/* ─── section wrapper ────────────────────────────────────────────────────── */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section-gap border-t border-outline">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-label-md text-text-subtle mb-8">{title}</p>
        {children}
      </div>
    </section>
  );
}

/* ─── page ───────────────────────────────────────────────────────────────── */
export default function DemoPage() {
  return (
    <div className="bg-bg min-h-screen">
      {/* Navbar */}
      {/* <Navbar
        links={[
          { label: "Destinations", href: "#destinations" },
          { label: "Packages", href: "#packages", isActive: true },
          { label: "Testimonials", href: "#testimonials" },
          { label: "Contact", href: "#forms" },
        ]}
      /> */}

      {/* Hero */}
      <div className="pt-16">
        <div className="mx-auto max-w-7xl px-6 section-gap">
          <PageHeader
            eyebrow="Component Library"
            title="Nocturnal Voyager"
            description="A dark, oceanic design system for crafting immersive travel experiences. Scroll to explore every component."
            align="center"
            actions={
              <>
                <Button variant="primary" size="lg">
                  <MapPin className="text-on-primary" />
                  Start Exploring
                </Button>
                <Button variant="secondary" size="lg">
                  View Source
                </Button>
              </>
            }
          />
        </div>
      </div>

      {/* Color Palette */}
      <Section id="colors" title="Color Palette">
        <ColorPalette />
      </Section>

      {/* Typography */}
      <Section id="typography" title="Typography Scale">
        <TypographyShowcase />
      </Section>

      {/* Buttons */}
      <Section id="buttons" title="Button Variants">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-body-sm text-text-subtle mb-4">Variants</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="icon" aria-label="Search">
                <span className="material-symbols-outlined text-[20px]">
                  <Search />
                </span>
              </Button>
              <Button variant="text">Text button</Button>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">Sizes</p>
            <div className="flex flex-wrap items-end gap-4">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">With icons</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">
                <span className="material-symbols-outlined text-[18px]">
                  rocket_launch
                </span>
                Book Now
              </Button>
              <Button variant="secondary">
                <span className="material-symbols-outlined text-[18px]">
                  favorite
                </span>
                Save Trip
              </Button>
              <Button variant="primary" href="#">
                <span className="material-symbols-outlined text-[18px]">
                  open_in_new
                </span>
                Link Button
              </Button>
            </div>
          </div>

          <div>
            <p className="text-body-sm text-text-subtle mb-4">
              Disabled states
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" disabled>
                Disabled Primary
              </Button>
              <Button variant="secondary" disabled>
                Disabled Secondary
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Forms */}
      <Section id="forms" title="Form Fields">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <FormField
            id="full-name"
            label="Full Name"
            placeholder="Sofia Reyes"
            required
            helperText="As it appears on your passport."
          />
          <FormField
            id="email"
            label="Email Address"
            type="email"
            placeholder="sofia@example.com"
            required
          />
          <FormField
            id="phone"
            label="Phone"
            type="tel"
            placeholder="+1 555 000 0000"
            errorMessage="Please enter a valid phone number."
          />
          <FormField id="departure" label="Departure Date" type="date" />
          <SelectField
            id="destination"
            label="Preferred Destination"
            placeholder="Choose a destination"
            required
            options={[
              { value: "santorini", label: "Santorini, Greece" },
              { value: "kyoto", label: "Kyoto, Japan" },
              { value: "patagonia", label: "Patagonia, Chile" },
              { value: "maldives", label: "Maldives" },
            ]}
            helperText="We'll tailor recommendations to your choice."
          />
          <SelectField
            id="budget"
            label="Budget Range"
            placeholder="Select budget"
            options={[
              { value: "budget", label: "Under $1,500" },
              { value: "mid", label: "$1,500 – $3,000" },
              { value: "luxury", label: "$3,000 – $6,000" },
              { value: "ultra", label: "$6,000+" },
            ]}
          />
          <TextAreaField
            id="notes"
            label="Special Requests"
            placeholder="Dietary requirements, accessibility needs, anniversary surprises…"
            maxLength={300}
            helperText="Anything that will make your trip perfect."
            className="md:col-span-2"
          />
        </div>
      </Section>

      {/* Destination Cards */}
      <Section id="destinations" title="Destination Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <DestinationCard key={d.title} {...d} />
          ))}
        </div>
      </Section>

      {/* Package Cards */}
      <Section id="packages" title="Package Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((p, i) => (
            <PackageCard key={p.title} {...p} highlighted={i === 1} />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" title="Testimonial Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.authorName} {...t} />
          ))}
        </div>
      </Section>

      {/* Footer */}
      <Footer />

      {/* FAB */}
      <FAB
        icon={<ArrowUp className="h-6 w-6" />}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
}
