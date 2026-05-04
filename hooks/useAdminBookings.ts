"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminBookings(status?: string) {
  return useQuery({
    queryKey: queryKeys.admin.bookings(status),
    queryFn: () => adminApi.getBookings(status),
    staleTime: 1000 * 30,
  });
}
