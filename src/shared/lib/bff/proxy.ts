import { NextRequest, NextResponse } from "next/server";
import { ProxyConfig, ProxyContext, ProxyHandler } from "@/shared/lib/bff/proxyTypes";
import { BodyInit } from "undici-types";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { deleteSession, getSession, updateSession } from "@/shared/lib/session/sessionStore";
import { ReissueRequest, ReissueResponse } from "@/features/auth/types/reissueTypes";
import { isProduction } from "@/shared/utils/env/envConfig";

/**
 * URL 안전 결합 (중복 슬레시 제거)
 */
function joinUrl(base: string, path: string, search: string): string {
  const trimmedBase: string = base.replace(/\/+$/, '');
  const trimmedPath: string = path.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}${search}`;
}

/**
 * 요청 헤더 복제 + 정리
 */
function buildUpstreamHeaders(
  request: NextRequest,
  backendHost: string,
  config: ProxyConfig,
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
      const token: string | undefined = request.cookies.get(config.promoteCookieToAuth.cookieName)?.value;
      if (token && token.length > 0) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }
  }

  // content-length는 런타임에서 재계산되므로 제거
  headers.delete("content-length");
  return headers;
}

/**
 * 세션 삭제 + sid 쿠키 제거 + 로그인페이지 리다이렉트
 */
function redirectLogin(sessionCookieName: string) {
  const response: NextResponse = NextResponse.redirect("/login");
  response.cookies.set(sessionCookieName, "", {
    httpOnly: isProduction(),
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    domain: isProduction() ? "campustable.shop" : "",
    maxAge: 0
  });

  return response;
}

/**
 * 중앙 프록시 팩토리
 */
export function createProxy(config: ProxyConfig): ProxyHandler {
  const backendUrl: URL = new URL(config.backendBaseUrl);
  const backendHost: string = backendUrl.host;

  return async (request: NextRequest, context: ProxyContext): Promise<Response> => {
    try {
      const { path: segments } = await context.params;
      const path: string = Array.isArray(segments) ? segments.join("/") : "";
      const apiPath: string = path.startsWith("api/") ? path : `api/${path}`;
      const requestUrl: URL = new URL(request.url);
      const target: string = joinUrl(config.backendBaseUrl, apiPath, requestUrl.search);

      // 요청 로깅
      console.log(`[BFF] ${request.method} /${apiPath} -> ${target}`);

      const upstreamHeaders: Headers = buildUpstreamHeaders(request, backendHost, config);

      const sessionCookieName: string = config.sessionCookieName ?? "sid";

      // 세션 기반 인증 처리 (sid -> Redis 세션 -> accessToken -> Authorization)
      if (config.useSessionAuth === true) {
        const sessionId: string | undefined = request.cookies.get(sessionCookieName)?.value;

        if (sessionId && sessionId.length > 0) {
          const session = await getSession(sessionId);

          if (session && session.accessToken.length > 0) {
            upstreamHeaders.set("authorization", `Bearer ${session.accessToken}`);
          }
        }
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

      if (config.useSessionAuth === true && upstream.status === 401 && !isAuthLoginPath && !isAuthReissuePath) {
        const sessionId: string | undefined = request.cookies.get(sessionCookieName)?.value;
        if (!sessionId || sessionId.length === 0) {
          return redirectLogin(sessionCookieName);
        }

        const session = await getSession(sessionId);
        if (!session || session.refreshToken.length === 0) {
          await deleteSession(sessionId);
          return redirectLogin(sessionCookieName);
        }

        // reissue 엔드포인트 호출
        const reissueUrl: string = joinUrl(config.backendBaseUrl, "api/auth/reissue", "");
        console.log("[BFF] reissue 시도: ", reissueUrl);
        let reissueResponse: Response;
        const reissueRequest: ReissueRequest = { refreshToken: session.refreshToken };
        try {
          reissueResponse = await fetch(reissueUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reissueRequest),
          });
        } catch (error) {
          console.error("[BFF] reissue 중 오류 발생:", error);
          await deleteSession(sessionId);
          return redirectLogin(sessionCookieName);
        }

        if (!reissueResponse.ok) {
          console.error("[BFF] reissue 실패, status:", reissueResponse.status);
          try {
            const errorBody = await reissueResponse.clone().json();
            console.error("[BFF] reissue 실패 응답:", errorBody);
          } catch {
            // 무시
          }
          await deleteSession(sessionId);
          return redirectLogin(sessionCookieName);
        }

        let reissueBody: ReissueResponse;
        try {
          reissueBody = (await reissueResponse.json()) as ReissueResponse;
        } catch (error) {
          console.error("[BFF] reissue 응답 JSON 파싱 오류:", error);
          await deleteSession(sessionId);
          return redirectLogin(sessionCookieName);
        }

        await updateSession(sessionId, reissueBody.accessToken, reissueBody.refreshToken);

        upstreamHeaders.set("authorization", `Bearer ${reissueBody.accessToken}`);

        console.log("[BFF] reissue 성공. 원래 요청 재시도");
        upstream = await fetch(target, {
          method: request.method,
          headers: upstreamHeaders,
          body,
        });

        // 재시도도 401이면 세션 정리 후 로그인 리다이렉트
        if (upstream.status === 401) {
          console.error("[BFF] 재시도 요청 401 -> 세션 종료 후 로그인 리다이렉트");
          await deleteSession(sessionId);
          return redirectLogin(sessionCookieName);
        }
      }

      // 응답 로깅
      console.log(`[BFF] /${apiPath} 응답: ${upstream.status} ${upstream.statusText}`);

      // 에러 응답 처리
      if (!upstream.ok) {
        console.error(`[BFF] /${apiPath} API 오류: ${upstream.status}`);

        try {
          const errorData = await upstream.clone().json();
          console.error(`[BFF] /${apiPath} 에러 내용:`, errorData);
        } catch {
          // JSON 파싱 실패 시 무시
        }
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
      console.error(`[BFF] 프록시 처리 중 오류:`, error);

      // 네트워크 오류 등의 경우 500 에러
      return NextResponse.json(
        {
          errorCode: ErrorCode.NETWORK_ERROR,
          errorMessage: "Backend API 호출 중 오류가 발생했습니다."
        },
        { status: 500 }
      );
    }
  };
}
