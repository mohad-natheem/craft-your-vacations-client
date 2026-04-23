import { api } from "@/lib/api";
import type {
  Destination,
  DestinationDetail,
  PackageDetail,
  User,
  OtpResponse,
  RegisterRequest,
  UpdateProfileRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from "@/app/types/api";

export const destinationsApi = {
  getAll: () => api.get<Destination[]>("destinations"),
  getBySlug: (slug: string) => api.get<DestinationDetail>(`destinations/${slug}`),
};

export const packagesApi = {
  getBySlugAndKey: (slug: string, key: string) =>
    api.get<PackageDetail>(`destinations/${slug}/packages/${key}`),
};

export const authApi = {
  register: (body: RegisterRequest) => api.post<User>("auth/register", body),
};

export const phoneApi = {
  sendOtp: (body: SendOtpRequest) =>
    api.post<OtpResponse>("phone/send-otp", body),
  verifyOtp: (body: VerifyOtpRequest) =>
    api.post<OtpResponse>("phone/verify-otp", body),
};

export const usersApi = {
  updateProfile: (body: UpdateProfileRequest) =>
    api.patch<User>("users/profile", body),
};
