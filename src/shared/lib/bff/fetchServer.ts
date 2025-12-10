import { NextRequest } from "next/server";
import { deleteSession, getSession, SESSION_COOKIE_NAME, updateSession } from "@/shared/lib/session/sessionStore";
import { CustomError } from "@/shared/lib/errors/customError";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { parseJsonResponse } from "@/shared/utils/api/apiUtils";
import { ReissueRequest, ReissueResponse } from "@/features/auth/types/reissueTypes";
import { handleErrorResponse } from "@/shared/lib/errors/errorResponse";
import { API_BASE_URL } from "@/shared/utils/env/envConfig";

export interface RequestOptions extends RequestInit {
  /**
   * 인증이 꼭 필요한 요청 여부
   * - false: sid / reissue 없이 호출
   */
  requireAuth?: boolean;

  /**
   * 세션 쿠키 이름
   */
  sessionCookieName?: string;
}

function buildUrl(endpoint: string): string {
  // 이미 절대 경로 URL이면 그대로 사용
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const trimmedBase: string = API_BASE_URL.replace(/\/+$/, "");
  const trimmedEndpoint: string = endpoint.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedEndpoint}`;
}

/**
 * BFF -> 백엔드 API 호출 공통 헬퍼
 * - 세션(sid) 기반 accessToken 주입
 * - 401 시 refreshToken으로 reissue 후 재시도
 */
export async function fetchServer<T>(
  request: NextRequest,
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url: string = buildUrl(endpoint);
  const requireAuth: boolean = options.requireAuth !== false;
  const sessionCookieName: string = options.sessionCookieName ?? SESSION_COOKIE_NAME;

  const headers: Headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let sessionId: string | undefined;

  if (requireAuth) {
    sessionId = request.cookies.get(sessionCookieName)?.value;

    if (!sessionId || sessionId.length === 0) {
      throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
    }

    const session = await getSession(sessionId);
    if (!session || session.accessToken.length === 0) {
      await deleteSession(sessionId);
      throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
    }

    headers.set("authorization", `Bearer ${session.accessToken}`);
  }

  const baseInit: RequestInit = {
    ...options,
    headers,
  };

  let response: Response;

  try {
    response = await fetch(url, baseInit);
  } catch (error) {
    // 네트워크 오류
    if (error instanceof Error && error.name === "AbortError") {
      throw new CustomError(ErrorCode.TIMEOUT_ERROR, 408);
    }
    throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
  }

  if (response.ok) {
    return await parseJsonResponse<T>(response);
  }

  // 인증이 필요하고 401 발생 + 세션 아이디가 있는 경우 -> reissue 시도
  if (requireAuth && response.status === 401 && sessionId) {
    const session = await getSession(sessionId);

    if (!session || !session.refreshToken || session.refreshToken.length === 0) {
      await deleteSession(sessionId);
      throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
    }

    // reissue 엔드포인트 호출
    const reissueUrl: string = buildUrl("api/auth/reissue");
    const reissueRequestBody: ReissueRequest = { refreshToken: session.refreshToken }

    let reissueResponse: Response;
    try {
      reissueResponse = await fetch(reissueUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reissueRequestBody),
      });
    } catch {
      await deleteSession(sessionId);
      throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
    }

    if (!reissueResponse.ok) {
      await deleteSession(sessionId);
      await handleErrorResponse(reissueResponse);
    }

    let reissueBody: ReissueResponse;
    try {
      reissueBody = (await reissueResponse.json()) as ReissueResponse;
    } catch {
      await deleteSession(sessionId);
      throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, 500);
    }

    await updateSession(sessionId, reissueBody.accessToken, reissueBody.refreshToken);

    // 새로운 accessToken 으로 재시도
    headers.set("authorization", `Bearer ${reissueBody.accessToken}`);

    const retryInit: RequestInit = {
      ...options,
      headers,
    };

    try {
      response = await fetch(url, retryInit);
    } catch {
      throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
    }

    if (!response.ok) {
      if (response.status === 401) {
        await deleteSession(sessionId);
        throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
      }
      await handleErrorResponse(response);
    }

    return await parseJsonResponse<T>(response);
  }

  await handleErrorResponse(response);
  throw new CustomError(ErrorCode.UNKNOWN_ERROR, response.status);
}
