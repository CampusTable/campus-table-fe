import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, SESSION_TTL_SECONDS } from "@/shared/lib/types/envUrls";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { createSession, SessionData } from "@/shared/lib/session/sessionStore";
import { LoginRequest, LoginResponse, LoginUpstreamResponse } from "@/features/auth/types/loginTypes";
import { isProduction } from "@/shared/utils/env/envUtils";

const SESSION_COOKIE_NAME = "sid";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const loginRequest: LoginRequest = await request.json();

    const upstream = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    if (!upstream.ok) {
      return NextResponse.json(await upstream.json(), { status: upstream.status });
    }

    const upstreamBody: LoginUpstreamResponse = (await upstream.json()) as LoginUpstreamResponse;

    const sessionData: SessionData = {
      studentNumber: upstreamBody.studentNumber,
      studentName: upstreamBody.studentName,
      accessToken: upstreamBody.accessToken,
      refreshToken: upstreamBody.refreshToken,
      maxAgeSeconds: upstreamBody.maxAgeSeconds,
      newUser: upstreamBody.newUser,
    };

    // 세션 생성 및 세션 ID 발급
    const sessionId: string = await createSession(sessionData);

    // 브라우저로 내려줄 응답
    const responseBody: LoginResponse = {
      studentNumber: upstreamBody.studentNumber,
      studentName: upstreamBody.studentName,
      newUser: upstreamBody.newUser,
    };

    const response: NextResponse = NextResponse.json(responseBody, { status: upstream.status });

    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: isProduction(),
      secure: isProduction(),
      sameSite: "strict",
      path: "/",
      domain: isProduction() ? "campustable.shop" : "",
      maxAge: sessionData.maxAgeSeconds ?? SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("[LoginRoute] 로그인 BFF 처리 중 오류:", error);

    return NextResponse.json(
      {
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        errorMessage: "로그인 처리 중 서버 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}