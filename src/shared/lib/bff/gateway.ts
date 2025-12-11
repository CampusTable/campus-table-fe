import { NextRequest, NextResponse } from "next/server";
import { BodyInit } from "undici-types";
import { createErrorNextResponse, handleErrorResponse } from "@/shared/lib/errors/errorResponse";
import { GatewayConfig, GatewayContext, GatewayHandler } from "@/shared/lib/bff/gatewayTypes";
import { buildApiUrlWithQueryString } from "@/shared/utils/api/apiUtils";
import { nvl } from "@/shared/utils/string/nvl";
import {
  applyAuthHeaders,
  AuthContextResult,
  createCookieReaderFromRequest,
  reissueAndUpdateSession,
  resolveAuthFromCookies
} from "@/shared/lib/auth/authHandler";

/**
 * 요청 헤더 복제 + 정리
 */
function buildUpstreamHeaders(
  request: NextRequest,
  backendHost: string,
  config: GatewayConfig,
): Headers {
  const headers = new Headers(request.headers);
  headers.set("host", backendHost);

  // 불필요한 헤더 제거
  const excluded = new Set((config.excludedRequestHeaders ?? [])
    .map((header) => header.toLowerCase())
  );

  for (const [header] of headers) {
    if (excluded.has(header.toLowerCase())) {
      headers.delete(header);
    }
  }

  // 쿠키 -> Authorization 승격
  if (config.promoteCookieToAuth) {
    const already: boolean = headers.has("authorization");
    const overwrite: boolean = config.promoteCookieToAuth.overwriteIfExists === true;
    if (!already || overwrite) {
      const token: string = nvl(request.cookies.get(config.promoteCookieToAuth.cookieName)?.value);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }
  }

  // content-length는 런타임에서 재계산되므로 제거
  headers.delete("content-length");
  return headers;
}

/**
 * 중앙 Gateway 팩토리
 * - /api/[...path] 에서 사용
 */
export function createGateway(config: GatewayConfig): GatewayHandler {
  const backendUrl: URL = new URL(config.backendBaseUrl);
  const backendHost: string = backendUrl.host;

  return async (request: NextRequest, context: GatewayContext): Promise<Response> => {
    try {
      const { path: segments } = await context.params;
      const path: string = Array.isArray(segments) ? segments.join("/") : "";
      const apiPath: string = path.startsWith("api/") ? path : `api/${path}`;
      const requestUrl: URL = new URL(request.url);
      const target: string = buildApiUrlWithQueryString(config.backendBaseUrl, apiPath, requestUrl.search);

      // 요청 로깅
      console.log(`[BFF Gateway] ${request.method} /${apiPath} -> ${target}`);

      const upstreamHeaders: Headers = buildUpstreamHeaders(request, backendHost, config);

      const authType = config.authType ?? "session";
      const requireAuth: boolean = config.requireAuth !== false && authType !== "none";

      let authContext: AuthContextResult = {};

      if (requireAuth) {
        const cookieReader = createCookieReaderFromRequest(request);
        authContext = await resolveAuthFromCookies(cookieReader, config);
        applyAuthHeaders(upstreamHeaders, authContext);
      }

      // body 처리
      let body: BodyInit | undefined = undefined;
      if (request.method !== "GET" && request.method !== "HEAD" && request.body) {
        body = await request.text();
      }

      let upstream: Response = await fetch(target, {
        method: request.method,
        headers: upstreamHeaders,
        body,
      });

      const isAuthReissuePath: boolean = apiPath === "api/auth/reissue";
      const isAuthLoginPath: boolean = apiPath === "api/auth/login";

      // [session 전략] 401 -> reissue -> 재시도 (login / reissue 엔드포인트 제외)
      if (requireAuth && authType === "session" && upstream.status === 401 && !isAuthLoginPath && !isAuthReissuePath && authContext.sessionId && authContext.refreshToken && (config.enableReissue ?? true)) {
        const updatedContext: AuthContextResult = await reissueAndUpdateSession(authContext.sessionId, authContext.refreshToken);
        applyAuthHeaders(upstreamHeaders, updatedContext);

        upstream = await fetch(target, {
          method: request.method,
          headers: upstreamHeaders,
          body,
        });
      }

      // 응답 로깅
      console.log(`[BFF Gateway] /${apiPath} 응답: ${upstream.status} ${upstream.statusText}`);

      // 에러 응답 처리
      if (!upstream.ok) {
        console.error(`[BFF Gateway] /${apiPath} API 오류: ${upstream.status}`);
        await handleErrorResponse(upstream);
      }

      // 응답을 그대로 브릿지(Set-Cookie 포함)
      const response = new NextResponse(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
      });

      upstream.headers.forEach((value: string, key: string) => {
        if (key.toLowerCase() === "set-cookie") {
          response.headers.append(key, value);
        } else {
          response.headers.set(key, value);
        }
      });

      return response;
    } catch (error) {
      return createErrorNextResponse(error);
    }
  };
}
