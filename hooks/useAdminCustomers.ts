"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminCustomers() {
  return useQuery({
    queryKey: queryKeys.admin.customers(),
    queryFn: adminApi.getCustomers,
    staleTime: 1000 * 60,
  });
}
