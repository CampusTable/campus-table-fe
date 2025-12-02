import Redis from "ioredis";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "@/shared/lib/types/envUrls";

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (redisClient === null) {
    redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    });

    redisClient.on("error", (error: Error) => {
      console.error("[Redis] 연결 오류", error);
    });

    redisClient.on("connect", () => {
      console.log("[Redis] 연결 성공");
    });
  }
  return redisClient;
}