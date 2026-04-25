"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useSubmitReview(destinationSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.my() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byDestination(destinationSlug),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.approved() });
    },
  });
}
