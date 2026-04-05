import axios from "axios";
import type { AxiosError } from "axios";

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  url?: string;
  method?: string;
};

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 5000,
});

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return {
      message: error.message || "Unbekannter API-Fehler",
      status: error.response?.status,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Unbekannter API-Fehler" };
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "message" in error;
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(normalizeApiError(error));
  },
);
