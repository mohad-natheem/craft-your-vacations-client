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
  key: string;
  days: number;
  price: number;
  title: string;
  excerpt: string;
}

export interface DestinationDetail {
  packages: DestinationPackage[];
  destinationCities: string[];
}

export interface Destination {
  id: number;
  slug: string;
  title: string;
  imagePath: string;
  content: string;
  minPackagePrice: number;
  detailJson: DestinationDetail;
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
