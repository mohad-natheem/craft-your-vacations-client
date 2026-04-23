"use client";

import { useMutation } from "@tanstack/react-query";
import { phoneApi } from "@/lib/endpoints";
import type { VerifyOtpRequest } from "@/app/types/api";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (body: VerifyOtpRequest) => phoneApi.verifyOtp(body),
  });
}
