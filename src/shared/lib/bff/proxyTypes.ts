import { NextRequest } from "next/server";

export interface ProxyContext {
  readonly params: Promise<{ path: string[] }>;
}

export interface ProxyConfig {
  readonly backendBaseUrl: string;
  // (선택) 쿠키를 Authorization: Bearer로 승격하고 싶을 때
  readonly promoteCookieToAuth?: {
    readonly cookieName: string;
    readonly overwriteIfExists?: boolean;
  };
  // (선택) 백엔드로 전달하지 않을 요청 헤더(소문자)
  readonly excludedRequestHeaders?: ReadonlyArray<string>;
  // (선택) 세션(sid) 기반 인증 여부
  readonly useSessionAuth?: boolean;
  // (선택) 세션 쿠키 이름 (기본: sid)
  readonly sessionCookieName?: string;
}

export type ProxyHandler = (request: NextRequest, context: ProxyContext) => Promise<Response>;