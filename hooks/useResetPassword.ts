"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/endpoints";
import type { ResetPasswordRequest } from "@/app/types/api";

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => authApi.resetPassword(body),
  });
}
