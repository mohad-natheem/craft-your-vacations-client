import { api } from "@/lib/api";
import type { Destination, User, OtpResponse } from "@/app/types/api";

export const destinationsApi = {
  getAll: () => api.get<Destination[]>("destinations"),
};

export const authApi = {
  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => api.post<User>("auth/register", body),
};

export const phoneApi = {
  sendOtp: (mobileNumber: string) =>
    api.post<OtpResponse>("phone/send-otp", { mobileNumber }),
  verifyOtp: (mobileNumber: string, otp: string) =>
    api.post<OtpResponse>("phone/verify-otp", { mobileNumber, otp }),
};

export const usersApi = {
  updateProfile: (body: {
    dateOfBirth?: string;
    nationality?: string;
    designation?: string;
  }) => api.patch<User>("users/profile", body),
};
