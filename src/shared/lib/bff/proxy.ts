import { NextRequest, NextResponse } from "next/server";
import { ProxyConfig, ProxyContext, ProxyHandler } from "@/shared/lib/bff/proxyTypes";
import { BodyInit } from "undici-types";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";

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

      // body 처리
      let body: BodyInit | undefined = undefined;
      if (request.method !== "GET" && request.method !== "HEAD" && request.body) {
        body = await request.text();
      }

      const upstream = await fetch(target, {
        method: request.method,
        headers: upstreamHeaders,
        body,
      });

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
