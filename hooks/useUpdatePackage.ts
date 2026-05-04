"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { UpdatePackageRequest } from "@/app/types/api";

export function useUpdatePackage(destId: number, destSlug: string, key: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdatePackageRequest) =>
      adminApi.updatePackage(destId, key, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.packages.detail(destSlug, key),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.detail(destSlug),
      });
    },
  });
}
