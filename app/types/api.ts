export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DestinationPackage {
  id: number;
  key: string;
  days: number;
  price: number;
  title: string;
  excerpt: string;
}

export type ActivityType =
  | "transport"
  | "leisure"
  | "sightseeing"
  | "dining"
  | "cultural"
  | "adventure";

export interface Activity {
  time: string;
  description: string;
  type: ActivityType;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: Activity[];
}

export interface PackageDetail {
  id: number;
  key: string;
  title: string;
  days: number;
  price: number;
  excerpt: string;
  itinerary: ItineraryDay[];
}

export interface Destination {
  id: number;
  slug: string;
  title: string;
  imagePath: string;
  content: string;
  minPackagePrice: number;
  isFeatured: boolean;
  destinationCities: string[];
}

export interface DestinationDetail extends Destination {
  packages: DestinationPackage[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  phoneVerified: boolean;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  profession?: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  profession?: string;
}

export interface SendOtpRequest {
  mobileNumber: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}
