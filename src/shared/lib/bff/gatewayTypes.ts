import { NextRequest } from "next/server";
import { CommonAuthOptions } from "@/shared/lib/auth/authHandler";

export interface GatewayContext {
  readonly params: Promise<{ path: string[] }>;
}

export interface GatewayConfig extends CommonAuthOptions {
  readonly backendBaseUrl: string;

  // (선택) 쿠키를 Authorization: Bearer로 승격하고 싶을 때
  readonly promoteCookieToAuth?: {
    readonly cookieName: string;
    readonly overwriteIfExists?: boolean;
  };

  // (선택) 백엔드로 전달하지 않을 요청 헤더(소문자)
  readonly excludedRequestHeaders?: ReadonlyArray<string>;
}

export type GatewayHandler = (request: NextRequest, context: GatewayContext) => Promise<Response>;