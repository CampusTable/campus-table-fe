// 정적파일 요청 판별
import { NextRequest, NextResponse } from "next/server";
import { AUTH_PAGE, AUTH_WHITELIST } from "@/shared/lib/types/authUrls";
import { SESSION_COOKIE_NAME } from "@/shared/lib/session/sessionStore";

const ACCESS_TOKEN_COOKIE_NAME: string = "accessToken";

function isStaticAsset(pathname: string): boolean {
  const hasExtension: boolean = pathname.includes(".");
  const isApiRoute: boolean = pathname.startsWith("/api");
  if (isApiRoute) {
    return false;
  }
  return hasExtension;
}

// 인증이 필요없는 경로 판별
function isAuthWhitelistPath(pathname: string): boolean {
  return AUTH_WHITELIST.some((basePath: string): boolean => {
    if (pathname === basePath) {
      return true;
    }
    return pathname.startsWith(`${basePath}/`);
  })
}

// 인증 상태에서 접근 가능 여부 판별
function isAuthOnlyPage(pathname: string): boolean {
  return AUTH_PAGE.some((basePath: string): boolean => {
    if (pathname === basePath) {
      return true;
    }
    return pathname.startsWith(`${basePath}/`);
  });
}

// 요청이 인증된 상태인지 판별
function isAuthenticated(request: NextRequest): boolean {
  const accessTokenCookie = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  const hasAccessToken: boolean = Boolean(accessTokenCookie?.value);
  const hasSessionId: boolean = Boolean(sessionCookie?.value);

  return hasAccessToken || hasSessionId;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 정적 리소스 통과
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // API 요청 통과
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const authenticated: boolean = isAuthenticated(request);
  const isWhitelistedPath: boolean = isAuthWhitelistPath(pathname);
  const isAuthPagePath: boolean = isAuthOnlyPage(pathname);

  // 로그인 X, 인증이 필요한 경로 접근 -> /login 리다이렉트
  if (!authenticated && !isWhitelistedPath) {
    const loginUrl: URL = new URL("/login", request.url);
    const callbackPath: string = `${pathname}${request.nextUrl.search}`;
    if (callbackPath !== "/") {
      loginUrl.searchParams.set("callbackUrl", callbackPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인된 사용자가 AUTH_PAGE 접근 시 -> 루트(/) 리다이렉트
  if (authenticated && isAuthPagePath) {
    const rootUrl: URL = new URL("/", request.url);
    return NextResponse.redirect(rootUrl);
  }

  return NextResponse.next();
}

/**
 * 미들웨어 적용 대상 경로 설정
 * - _next 정적 파일, 이미지, PWA 파일 등은 제외
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)",
  ],
};