"use client";

import { useQuery } from "@tanstack/react-query";
import { packagesApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function usePackageDetail(slug: string, key: string) {
  return useQuery({
    queryKey: queryKeys.packages.detail(slug, key),
    queryFn: () => packagesApi.getBySlugAndKey(slug, key),
    staleTime: 1000 * 60 * 5,
  });
}
