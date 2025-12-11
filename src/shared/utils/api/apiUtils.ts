import { API_BASE_URL } from "@/shared/utils/env/envConfig";

/**
 * 공통 JSON 파서
 */
export async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    // body 가 없거나 JSON 파싱 실패
    return undefined as T;
  }
}

/**
 * 백엔드 API URL 생성
 */
export function buildApiUrl(endpoint: string, baseUrl?: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const targetBase: string = (baseUrl ?? API_BASE_URL).replace(/\/+$/, "");
  const trimmedEndpoint: string = endpoint.replace(/^\/+/, "");

  return `${targetBase}/${trimmedEndpoint}`;
}

/**
 * 쿼리스트링 포함 URL 생성
 */
export function buildApiUrlWithQueryString(baseUrl: string, endpoint: string, search: string): string {
  const url: string = buildApiUrl(endpoint, baseUrl);
  return `${url}${search}`;
}