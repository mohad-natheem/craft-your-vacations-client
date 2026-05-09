"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { AdminUpdateBookingRequest } from "@/app/types/api";

export function useAdminUpdateBooking(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AdminUpdateBookingRequest) =>
      adminApi.updateBooking(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.allBookings() });
    },
  });
}
