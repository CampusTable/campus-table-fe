import "server-only";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }
  return value;
}

export const serverEnv = {
  ORIGIN_URL: requireEnv("NEXT_PUBLIC_ORIGIN_URL"),
  API_BASE_URL: requireEnv("NEXT_PUBLIC_API_BASE_URL"),
  REDIS_HOST: requireEnv("REDIS_HOST"),
  REDIS_PORT: parseInt(requireEnv("REDIS_PORT")),
  REDIS_PASSWORD: requireEnv("REDIS_PASSWORD"),
  SESSION_TTL_SECONDS: parseInt(requireEnv("SESSION_TTL_SECONDS")),
}