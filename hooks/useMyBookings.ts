"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useMyBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.my(),
    queryFn: bookingsApi.getMyBookings,
    staleTime: 1000 * 30,
  });
}
