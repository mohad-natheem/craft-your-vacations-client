"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.my() });
    },
  });
}
