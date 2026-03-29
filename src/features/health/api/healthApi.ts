import { httpClient } from "@/lib/api/httpClient";

export type HealthResponse = {
  status: string;
  [key: string]: unknown;
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await httpClient.get<HealthResponse>("/health");
  return response.data;
}
