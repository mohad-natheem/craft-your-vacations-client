"use client";

import { useQuery } from "@tanstack/react-query";
import { destinationsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useDestinations() {
  return useQuery({
    queryKey: queryKeys.destinations,
    queryFn: async () => {
      const result = await destinationsApi.getAll();
      console.log("queryFn result:", result); // check this in browser console
      return result;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes before marking stale
  });
}
