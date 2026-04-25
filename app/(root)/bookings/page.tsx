"use client";

import { useMyBookings } from "@/hooks/useMyBookings";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ErrorState from "@/components/ErrorState/ErrorState";
import Button from "@/components/Button/Button";
import BookingCard from "@/components/BookingCard/BookingCard";
import { CalendarDays } from "lucide-react";

export default function BookingsPage() {
  const { data: bookings, isLoading, isError, error, refetch } = useMyBookings();

  if (isLoading) {
    return <LoadingSpinner message="Loading your travel interests…" fullScreen={false} />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-display-sm text-text">My Bookings</h1>
        <p className="text-body-lg text-text-muted mt-2">
          Packages you&apos;ve expressed interest in. Our team will reach out
          to tailor each trip to your preferences.
        </p>
      </div>

      {/* Empty state */}
      {bookings?.length === 0 && (
        <div className="glass ghost-border rounded-3xl p-12 flex flex-col items-center gap-5 text-center">
          <CalendarDays className="w-10 h-10 text-primary/50" strokeWidth={1.5} />
          <div>
            <p className="text-headline-sm text-text">No booking interests yet</p>
            <p className="text-body-md text-text-muted mt-1">
              Browse packages and express your interest to get started.
            </p>
          </div>
          <Button variant="primary" href="/destinations">
            Explore Destinations
          </Button>
        </div>
      )}

      {/* Booking list */}
      <div className="flex flex-col gap-4">
        {bookings?.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
