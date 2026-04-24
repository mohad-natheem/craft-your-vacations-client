"use client";

import { useMutation } from "@tanstack/react-query";
import { usersApi } from "@/lib/endpoints";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (body: {
      name?: string;
      dateOfBirth?: string;
      nationality?: string;
      countryOfResidence?: string;
      profession?: string;
    }) => usersApi.updateProfile(body),
  });
}
