"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/endpoints";
import type { StartResetRequest } from "@/app/types/api";

export function useStartReset() {
  return useMutation({
    mutationFn: (body: StartResetRequest) => authApi.startReset(body),
  });
}
