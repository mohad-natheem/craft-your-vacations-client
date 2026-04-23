"use client";

import { useMutation } from "@tanstack/react-query";
import { phoneApi } from "@/lib/endpoints";
import type { SendOtpRequest } from "@/app/types/api";

export function useSendOtp() {
  return useMutation({
    mutationFn: (body: SendOtpRequest) => phoneApi.sendOtp(body),
  });
}
