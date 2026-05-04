"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useDeletePackage(destId: number, destSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => adminApi.deletePackage(destId, key),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.detail(destSlug),
      });
    },
  });
}
