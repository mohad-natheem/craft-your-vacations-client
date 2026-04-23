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
  dateOfBirth?: string;
  nationality?: string;
  designation?: string;
}

export interface SendOtpRequest {
  mobileNumber: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}
