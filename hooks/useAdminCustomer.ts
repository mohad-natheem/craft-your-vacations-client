"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.customer(id),
    queryFn: () => adminApi.getCustomer(id),
    staleTime: 1000 * 60,
    enabled: !!id,
  });
}
