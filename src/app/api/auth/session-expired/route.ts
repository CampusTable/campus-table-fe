import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/shared/lib/session/sessionStore";

/**
 * SSR에서 세션 만료 시 쿠키 삭제를 위한 Route Handler
 * - apiServer에서 인증 실패 시 여기로 리다이렉트
 * - sid 쿠키 삭제 후 로그인 페이지 리다이렉트
 */
export async function GET(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  // sid 세션 쿠키 삭제
  response.cookies.delete(SESSION_COOKIE_NAME);

  return response;
}