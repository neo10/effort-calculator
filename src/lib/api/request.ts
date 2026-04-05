import type { AxiosRequestConfig } from "axios";

import { httpClient } from "@/lib/api/httpClient";

export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.get<T>(url, config);
  return response.data;
}

export async function apiPost<TRequest, TResponse>(
  url: string,
  payload: TRequest,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await httpClient.post<TResponse>(url, payload, config);
  return response.data;
}

