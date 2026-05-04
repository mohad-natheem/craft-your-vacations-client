"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateDestinationRequest } from "@/app/types/api";

export function useCreateDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateDestinationRequest) =>
      adminApi.createDestination(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() });
    },
  });
}
