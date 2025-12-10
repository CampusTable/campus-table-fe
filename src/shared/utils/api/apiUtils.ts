export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const status: number = response.status;
  const contentLength: string | null = response.headers.get("content-length");
  const contentType: string | null = response.headers.get("content-type");

  // 204/205/206: 바디 없음
  if (status === 204 || status === 205 || status === 304) {
    return undefined as T;
  }

  if (contentLength === "0") {
    return undefined as T;
  }

  if (!contentType || !contentType.includes("application/json")) {
    return undefined as T;
  }

  const data: unknown = response.json();
  return data as T;
}