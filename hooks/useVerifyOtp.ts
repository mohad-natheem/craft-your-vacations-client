"use client";

import { useMutation } from "@tanstack/react-query";
import { phoneApi } from "@/lib/endpoints";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ mobileNumber, otp }: { mobileNumber: string; otp: string }) =>
      phoneApi.verifyOtp(mobileNumber, otp),
  });
}
