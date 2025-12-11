import "server-only";
import { handleErrorResponse } from "@/shared/lib/errors/errorResponse";
import { CustomError } from "@/shared/lib/errors/customError";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { buildApiUrl, parseJsonResponse } from "@/shared/utils/api/apiUtils";
import {
  applyAuthHeaders,
  AuthContextResult,
  CommonAuthOptions,
  createCookieReaderFromServer,
  reissueAndUpdateSession,
  resolveAuthFromCookies
} from "@/shared/lib/auth/authHandler";
import { deleteSession } from "@/shared/lib/session/sessionStore";

export interface ServerRequestOptions extends RequestInit, CommonAuthOptions {
}

export class ApiServer {
  /**
   * 공통 요청 메서드
   * - SSR / 서버 컴포넌트에서 직접 백엔드 호출할 때 사용
   */
  async request<T>(
    endpoint: string,
    options: ServerRequestOptions = {}
  ): Promise<T> {
    const url: string = buildApiUrl(endpoint);
    const authType = options.authType ?? "session";
    const requireAuth: boolean = options.requireAuth !== false && authType === "session";

    // 서버 컴포넌트 로깅
    console.log(`[ApiServer] ${options.method} ${endpoint} → ${url}`);

    // 공통 헤더 구성
    const headers: Headers = new Headers(options.headers ?? {});
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    let authContext: AuthContextResult = {};

    // 쿠키 기반 인증 처리 (session / cookieToken)
    if (requireAuth) {
      const cookieReader = await createCookieReaderFromServer();
      authContext = await resolveAuthFromCookies(cookieReader, options);
      applyAuthHeaders(headers, authContext);
    }

    let response: Response;

    try {
      response = await fetch(url, {
        ...options,
        headers,
        cache: "no-store",
      });
    } catch (error) {
      console.error(`[ApiServer] ${endpoint} 요청 중 오류:`, error);

      if (error instanceof Error && error.name === "AbortError") {
        throw new CustomError(ErrorCode.TIMEOUT_ERROR, 408);
      }

      throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
    }

    // 응답 로깅
    console.log(`[ApiServer] ${endpoint} 응답: ${response.status} ${response.statusText}`);

    // 1차 호출이 성공이면 바로 JSON 파싱
    if (response.ok) {
      return await parseJsonResponse<T>(response);
    }

    // 401 + reissue 허용 시 재발급 시도
    const enableReissue: boolean = options.enableReissue !== false;

    if (requireAuth && response.status === 401 && enableReissue && authContext.sessionId && authContext.refreshToken) {
      console.log("[ApiServer] accessToken 재발급을 진행합니다");
      const updatedContext: AuthContextResult = await reissueAndUpdateSession(authContext.sessionId, authContext.refreshToken);
      applyAuthHeaders(headers, updatedContext);

      try {
        response = await fetch(url, {
          ...options,
          headers,
          cache: "no-store",
        });
      } catch {
        throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
      }

      if (!response.ok) {
        if (response.status === 401 && updatedContext.sessionId) {
          await deleteSession(updatedContext.sessionId);
          throw new CustomError(ErrorCode.UNAUTHORIZED, 401);
        }
        await handleErrorResponse(response);
      }
      return await parseJsonResponse(response);
    }

    // 그 외 에러 공통 처리
    await handleErrorResponse(response);
    throw new CustomError(ErrorCode.UNKNOWN_ERROR, response.status);
  }


  // 편의 메서드
  async get<T>(endpoint: string, options?: ServerRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...(options ?? {}),
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: unknown, options?: ServerRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...(options ?? {}),
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: ServerRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...(options ?? {}),
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: ServerRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...(options ?? {}),
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: ServerRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...(options ?? {}),
      method: 'DELETE'
    });
  }
}

// 서버 컴포넌트용 싱글톤 인스턴스
export const apiServer = new ApiServer();