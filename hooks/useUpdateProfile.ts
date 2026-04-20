"use client";

import { useMutation } from "@tanstack/react-query";
import { usersApi } from "@/lib/endpoints";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (body: {
      dateOfBirth?: string;
      nationality?: string;
      designation?: string;
    }) => usersApi.updateProfile(body),
  });
}
