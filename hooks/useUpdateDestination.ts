"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { CreateDestinationRequest } from "@/app/types/api";

export function useUpdateDestination(id: number, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<CreateDestinationRequest>) =>
      adminApi.updateDestination(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.detail(slug),
      });
    },
  });
}
