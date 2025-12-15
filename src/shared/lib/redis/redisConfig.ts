import Redis from "ioredis";
import { serverEnv } from "@/shared/config/env.server";

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (redisClient === null) {
    redisClient = new Redis({
      host: serverEnv.REDIS_HOST,
      port: serverEnv.REDIS_PORT,
      password: serverEnv.REDIS_PASSWORD,
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