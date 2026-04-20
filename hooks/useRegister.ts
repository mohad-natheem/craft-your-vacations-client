"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/endpoints";

export function useRegister() {
  return useMutation({
    mutationFn: (body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => authApi.register(body),
  });
}
