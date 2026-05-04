"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { CreatePackageRequest } from "@/app/types/api";

export function useCreatePackage(destId: number, destSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreatePackageRequest) =>
      adminApi.createPackage(destId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.detail(destSlug),
      });
    },
  });
}
