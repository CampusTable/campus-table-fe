export const ORIGIN_URL: string = process.env.NEXT_PUBLIC_ORIGIN_URL ?? "";
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const REDIS_HOST: string = process.env.REDIS_HOST ?? "";
export const REDIS_PORT: number = Number(process.env.REDIS_PORT);
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD ?? "";
export const SESSION_TTL_SECONDS: number = Number(process.env.SESSION_TTL_SECONDS);

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

if (!ORIGIN_URL) {
  throw new Error("ORIGIN_URL 환경변수가 설정되지 않았습니다.");
}

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL 환경변수가 설정되지 않았습니다.");
}

if (!REDIS_HOST) {
  throw new Error("REDIS_HOST 환경변수가 설정되지 않았습니다.");
}

if (!REDIS_PORT) {
  throw new Error("REDIS_PORT 환경변수가 설정되지 않았습니다.");
}

if (!REDIS_PASSWORD) {
  throw new Error("REDIS_PASSWORD 환경변수가 설정되지 않았습니다.");
}

if (!SESSION_TTL_SECONDS) {
  throw new Error("SESSION_TTL_SECONDS 환경변수가 설정되지 않았습니다.");
}