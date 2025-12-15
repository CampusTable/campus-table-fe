import "server-only";
import { NextRequest } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { deleteSession, getSession, SESSION_COOKIE_NAME, updateSession } from "@/shared/lib/session/sessionStore";
import { nvl } from "@/shared/utils/string/nvl";
import { CustomError } from "@/shared/lib/errors/customError";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { buildApiUrl } from "@/shared/utils/api/apiUtils";
import { ReissueRequest, ReissueResponse } from "@/features/auth/types/reissueTypes";
import { handleErrorResponse } from "@/shared/lib/errors/errorResponse";

export type AuthStrategyType = "none" | "session";

export interface CommonAuthOptions {
  /**
   * 인증 필요 여부
   * - 기본값: authType !== "none" 이면 true
   */
  requireAuth?: boolean;

  /**
   * 인증 전략 타입
   * - "session" : sid + Redis 세션 기반 (기본)
   * - "none" 인증X
   */
  authType?: AuthStrategyType;

  /**
   * 세션 쿠키 이름 (session 전략)
   */
  sessionCookieName?: string;

  /**
   * 401 발생 시 reissue 시도 여부
   * - 기본값: true
   */
  enableReissue?: boolean;
}

export interface AuthContextResult {
  sessionId?: string,
  accessToken?: string,
  refreshToken?: string,
}

export interface CookieReader {
  get(name: string): string | undefined;
}

/**
 * NextRequest 기반 쿠키 리더 (BFF / route 핸들러 사용)
 */
export function createCookieReaderFromRequest(request: NextRequest): CookieReader {
  return {
    get(name: string): string | undefined {
      const cookie = request.cookies.get(name);
      return cookie?.value;
    },
  };
}

/**
 * SSR에서 사용하는 쿠키 리더
 */
export async function createCookieReaderFromServer(): Promise<CookieReader> {
  const cookieStore: ReadonlyRequestCookies = await cookies();
  return {
    get(name: string): string | undefined {
      const cookie = cookieStore.get(name);
      return cookie?.value;
    }
  }
}

/**
 * 쿠키에서 인증 정보(session / token)를 읽어 AuthContextResult 로 변환
 * - requireAuth && authType !== "none" 인 경우에만 필수 검증 수행
 * - 실패 시 CustomError(UNAUTHORIZED) throw
 */
export async function resolveAuthFromCookies(
  cookieReader: CookieReader,
  options: CommonAuthOptions,
): Promise<AuthContextResult> {
  const authType: AuthStrategyType = options.authType ?? "session";
  const requireAuth: boolean = options.requireAuth !== false && authType === "session";

  if (!requireAuth || authType === "none") {
    return {};
  }

  // [session 전략] sid -> Redis 세션 -> accessToken / refreshToken
  const sessionCookieName: string = options.sessionCookieName ?? SESSION_COOKIE_NAME;
  const sessionId: string = nvl(cookieReader.get(sessionCookieName));

  if (!sessionId) {
    throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
  }

  const session = await getSession(sessionId);
  if (!session || !nvl(session.accessToken)) {
    await deleteSession(sessionId);
    throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
  }

  return {
    sessionId,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken
  };
}

/**
 * Authorization 헤더 주입
 */
export function applyAuthHeaders(
  headers: Headers,
  authContext: AuthContextResult,
): void {
  if (nvl(authContext.accessToken)) {
    headers.set("authorization", `Bearer ${authContext.accessToken}`);
  }
}

/**
 * 공통 reissue 처리
 * - refreshToken 을 통해 reissue 엔드포인트 호출
 * - 새 accessToken / refreshToken 반환
 */
export async function callReissue(
  refreshToken: string,
  reissueEndpoint: string = "api/auth/reissue",
): Promise<ReissueResponse> {
  const url: string = buildApiUrl(reissueEndpoint);

  const requestBody: ReissueRequest = { refreshToken };

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
  }

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  let reissueResponse: ReissueResponse;
  try {
    reissueResponse = (await response.json()) as ReissueResponse;
  } catch {
    throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, 500);
  }

  return reissueResponse;
}

/**
 * [session 전략 전용] reissue + Redis 세션 업데이트 수행
 */
export async function reissueAndUpdateSession(
  sessionId: string,
  refreshToken: string,
): Promise<AuthContextResult> {
  const reissueResponse: ReissueResponse = await callReissue(refreshToken);

  await updateSession(
    sessionId,
    reissueResponse.accessToken,
    reissueResponse.refreshToken,
  );

  return {
    sessionId,
    accessToken: reissueResponse.accessToken,
    refreshToken: reissueResponse.refreshToken,
  };
}