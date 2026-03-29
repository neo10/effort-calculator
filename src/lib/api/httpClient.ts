import axios from "axios";
import type { AxiosError } from "axios";

export type ApiError = {
  message: string;
  status?: number;
};

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  timeout: 5000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || "Unbekannter API-Fehler",
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  },
);
