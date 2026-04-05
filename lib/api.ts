import { ApiResponse, PaginatedResponse } from "@/app/types/api";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const client: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Response interceptor — global error handling

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired"));
      }

      const message =
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "An unexpected error occurred";

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Core private execute — single place where every request is made.
// All public methods below delegate to this.
// ---------------------------------------------------------------------------

async function getRaw<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await client.get<TResponse>(url, config);
  console.log("[api.getRaw] url:", url, "| response.data:", response.data);
  return response.data;
}

// GET — response is wrapped in { data: T, success, message } envelope
async function get<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await client.get<ApiResponse<TResponse>>(url, config);
  console.log("[api.get] url:", url, "| response.data:", response.data);
  return response.data.data;
}

// .NET returns { data: T[], total, page, pageSize, totalPages }
async function getPaginated<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<PaginatedResponse<TResponse>> {
  const response = await client.get<PaginatedResponse<TResponse>>(url, config);
  return response.data;
}

async function post<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await client.post<ApiResponse<TResponse>>(url, body, config);
  return response.data.data;
}

async function put<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await client.put<ApiResponse<TResponse>>(url, body, config);
  return response.data.data;
}

async function patch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await client.patch<ApiResponse<TResponse>>(
    url,
    body,
    config,
  );
  return response.data.data;
}

async function del<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await client.delete<ApiResponse<TResponse>>(url, config);
  return response.data.data;
}

// ---------------------------------------------------------------------------
// Named export — use as: api.get(...), api.post(...), api.getPaginated(...)
// ---------------------------------------------------------------------------
export const api = {
  get,
  getRaw,
  getPaginated,
  post,
  put,
  patch,
  delete: del,
} as const;
