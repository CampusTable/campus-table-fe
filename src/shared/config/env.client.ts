export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export const clientEnv = {
  ORIGIN_URL: process.env.NEXT_PUBLIC_ORIGIN_URL ?? "",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
}