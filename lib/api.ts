import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const client: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

client.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retried?: boolean;
      };
      if (error.response?.status === 401 && !originalRequest._retried) {
        originalRequest._retried = true;
        // Force NextAuth to run the jwt callback (refresh logic) and update the cookie
        const session = await fetch("/api/auth/session").then((r) => r.json());
        if (session?.error === "RefreshAccessTokenError" || !session?.user) {
          window.location.href = "/login";
          return Promise.reject(new Error("Session expired"));
        }
        // Retry the original request once with the refreshed token
        return client(originalRequest);
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

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.post<T>(url, body, config).then((r) => r.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.put<T>(url, body, config).then((r) => r.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.patch<T>(url, body, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    client.delete<T>(url, config).then((r) => r.data),
};
