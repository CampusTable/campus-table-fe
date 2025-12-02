import { randomUUID } from "node:crypto";
import { SESSION_TTL_SECONDS } from "@/shared/lib/types/envUrls";
import { getRedisClient } from "@/shared/lib/redis/redisConfig";
import Redis from "ioredis";

export interface SessionData {
  studentNumber: string;
  studentName: string;
  accessToken: string;
  refreshToken: string;
  maxAgeSeconds: number; // refreshToken 만료시간
  newUser: boolean;
}

const TTL: number = Number(SESSION_TTL_SECONDS);

const SESSION_PREFIX: string = "session:";

const redisClient: Redis = getRedisClient();

/**
 * Redis에 SessionData 저장
 */
export async function createSession(sessionData: SessionData): Promise<string> {
  const sessionId: string = randomUUID();
  const key: string = getKey(sessionId);
  const payload: string = JSON.stringify(sessionData);

  await redisClient.set(key, payload, "EX", sessionData.maxAgeSeconds ?? TTL);

  return sessionId;
}

/**
 * 세션 조회
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  const key: string = getKey(sessionId);
  const payload: string | null = await redisClient.get(key);

  if (payload === null) {
    return null;
  }

  try {
    return JSON.parse(payload) as SessionData;
  } catch (error) {
    console.error("[SessionStore] 세션 JSON 파싱 오류:", error);
    return null;
  }
}

/**
 * 세션 업데이트 (엑세스 & 리프레시 토큰 재발급)
 */
export async function updateSession(sessionId: string, accessToken: string, refreshToken: string) {
  const key: string = getKey(sessionId);
  const payload: string | null = await redisClient.get(key);

  if (payload === null) {
    return;
  }

  try {
    const existingSessionData: SessionData = JSON.parse(payload) as SessionData;
    const updatedSessionData: SessionData = {
      ...existingSessionData,
      accessToken,
      refreshToken,
    };

    await redisClient.set(key, JSON.stringify(updatedSessionData), "EX", updatedSessionData.maxAgeSeconds ?? TTL);
  } catch (error) {
    console.error("[SessionStore] updateSession 오류:", error);
  }
}

/**
 * 세션 삭제
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const key: string = getKey(sessionId);
  await redisClient.del(key);
}

function getKey(sessionId: string): string {
  return SESSION_PREFIX + sessionId;
}