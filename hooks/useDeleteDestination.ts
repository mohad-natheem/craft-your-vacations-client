"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useDeleteDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminApi.deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() });
    },
  });
}
