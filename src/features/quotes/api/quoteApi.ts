import { apiEndpoints } from "@/lib/api/endpoints";
import { apiGet } from "@/lib/api/request";

export type QuoteItem = {
  q: string;
  a: string;
  h: string;
};

export type QuoteResponse = QuoteItem[];

export async function getRandomQuote(): Promise<QuoteResponse> {
  return apiGet<QuoteResponse>(apiEndpoints.randomQuote);
}
