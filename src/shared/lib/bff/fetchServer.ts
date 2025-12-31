import "server-only";
import { NextRequest } from "next/server";
import { CustomError } from "@/shared/lib/errors/customError";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { buildApiUrl, parseJsonResponse } from "@/shared/utils/api/apiUtils";
import { handleErrorResponse } from "@/shared/lib/errors/errorResponse";
import {
  applyAuthHeaders,
  AuthContextResult,
  CommonAuthOptions,
  createCookieReaderFromRequest,
  reissueAndUpdateSession,
  resolveAuthFromCookies
} from "@/shared/lib/auth/authHandler";
import { deleteSession } from "@/shared/lib/session/sessionStore";

export interface BffRequestOptions extends RequestInit, CommonAuthOptions {
}

/**
 * BFF(app/api/*) 라우트 -> 백엔드 API 호출 공통 헬퍼
 * - NextRequest 기반 쿠키 read
 * - session / cookieToken 전략에 따라 Authorization 헤더 세팅
 * - session 전략일 때만 401 -> reissue -> 재시도 수행
 */
export async function fetchServer<T>(
  request: NextRequest,
  endpoint: string,
  options: BffRequestOptions = {},
): Promise<T> {
  const url: string = buildApiUrl(endpoint);
  const authType = options.authType ?? "session";
  const requireAuth = options.requireAuth !== false && authType === "session";

  const headers: Headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let authContext: AuthContextResult = {};

  if (requireAuth) {
    const cookieReader = createCookieReaderFromRequest(request);
    authContext = await resolveAuthFromCookies(cookieReader, options);
    applyAuthHeaders(headers, authContext);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new CustomError(ErrorCode.TIMEOUT_ERROR, 408);
    }
    throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
  }

  if (response.ok) {
    return await parseJsonResponse<T>(response);
  }

  // 401 + reissue 허용 시 재발급 시도
  const enableReissue: boolean = options.enableReissue !== false;

  if (requireAuth && response.status === 401 && enableReissue && authContext.sessionId && authContext.refreshToken) {
    authContext = await reissueAndUpdateSession(authContext.sessionId, authContext.refreshToken);
    applyAuthHeaders(headers, authContext);

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
      if (response.status === 401 && authContext.sessionId) {
        await deleteSession(authContext.sessionId);
        throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
      }
      await handleErrorResponse(response);
    }
    return await parseJsonResponse<T>(response);
  }

  await handleErrorResponse(response);
  throw new CustomError(ErrorCode.UNKNOWN_ERROR, response.status);
}

export async function getFetchServer<T>(
  request: NextRequest,
  endpoint: string,
  options?: BffRequestOptions,
): Promise<T> {
  return fetchServer<T>(request, endpoint, {
    ...(options ?? {}),
    method: "GET",
  });
}

export async function postFetchServer<T>(
  request: NextRequest,
  endpoint: string,
  data?: unknown,
  options?: BffRequestOptions,
): Promise<T> {
  return fetchServer<T>(request, endpoint, {
    ...(options ?? {}),
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function putFetchServer<T>(
  request: NextRequest,
  endpoint: string,
  data?: unknown,
  options?: BffRequestOptions,
): Promise<T> {
  return fetchServer<T>(request, endpoint, {
    ...(options ?? {}),
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function patchFetchServer<T>(
  request: NextRequest,
  endpoint: string,
  data?: unknown,
  options?: BffRequestOptions,
): Promise<T> {
  return fetchServer<T>(request, endpoint, {
    ...(options ?? {}),
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function deleteFetchServer<T>(
  request: NextRequest,
  endpoint: string,
  options?: BffRequestOptions,
): Promise<T> {
  return fetchServer<T>(request, endpoint, {
    ...(options ?? {}),
    method: "DELETE",
  });
}
