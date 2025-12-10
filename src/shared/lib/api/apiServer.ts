import { handleErrorResponse } from "@/shared/lib/errors/errorResponse";
import { CustomError } from "@/shared/lib/errors/customError";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { deleteSession, getSession, SESSION_COOKIE_NAME, updateSession } from "@/shared/lib/session/sessionStore";
import { ReissueRequest, ReissueResponse } from "@/features/auth/types/reissueTypes";
import { API_BASE_URL } from "@/shared/utils/env/envConfig";
import { parseJsonResponse } from "@/shared/utils/api/apiUtils";
import { cookies } from "next/headers";

export interface ServerRequestOptions extends RequestInit {
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

export class ApiServer {
  /**
   * 공통 요청 메서드
   */
  async request<T>(
    endpoint: string,
    options: ServerRequestOptions = {}
  ): Promise<T> {
    const url: string = buildUrl(endpoint);
    const requireAuth: boolean = options.requireAuth !== false;
    const sessionCookieName: string = options.sessionCookieName ?? SESSION_COOKIE_NAME;

    // 서버 컴포넌트 로깅
    console.log(`[SSR] ${options.method || 'GET'} ${endpoint} → ${url}`);

    const headers: Headers = new Headers(options.headers ?? {});
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    let sessionId: string | undefined;

    if (requireAuth) {
      const cookieStore = await cookies();
      sessionId = cookieStore.get(sessionCookieName)?.value;
      console.log("sessionId:", sessionId);

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

    let response: Response;

    try {
      response = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store', // SSR 기본 캐시 정책
      });
    } catch (error) {
      // 서버 컴포넌트 에러 처리
      console.error(`[SSR] ${endpoint} 요청 중 오류:`, error);

      if (error instanceof Error && error.name === "AbortError") {
        throw new CustomError(ErrorCode.TIMEOUT_ERROR, 408);
      }
      throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
    }

    // 응답 로깅
    console.log(`[SSR] ${endpoint} 응답: ${response.status} ${response.statusText}`);

    // 1차 호출이 성공이면 바로 JSON 파싱
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