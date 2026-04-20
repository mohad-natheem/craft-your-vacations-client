"use client";

import { useMutation } from "@tanstack/react-query";
import { phoneApi } from "@/lib/endpoints";

export function useSendOtp() {
  return useMutation({
    mutationFn: (mobileNumber: string) => phoneApi.sendOtp(mobileNumber),
  });
}
