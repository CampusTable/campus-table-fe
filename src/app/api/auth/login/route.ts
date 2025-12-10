import { NextRequest, NextResponse } from "next/server";
import { createSession, SESSION_COOKIE_NAME, SessionData } from "@/shared/lib/session/sessionStore";
import { LoginRequest, LoginResponse, LoginApiResponse } from "@/features/auth/types/loginTypes";
import { isProduction, SESSION_TTL_SECONDS } from "@/shared/utils/env/envConfig";
import { createErrorNextResponse } from "@/shared/lib/errors/errorResponse";
import { fetchServer } from "@/shared/lib/bff/fetchServer";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const loginRequest: LoginRequest = await request.json();

    const upstreamBody: LoginApiResponse = await fetchServer<LoginApiResponse>(
      request,
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(loginRequest),
        requireAuth: false,
      },
    );

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

    const response: NextResponse = NextResponse.json(responseBody, { status: 200 });

    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: isProduction(),
      secure: isProduction(),
      sameSite: "strict",
      path: "/",
      domain: isProduction() ? "campustable.shop" : undefined,
      maxAge: sessionData.maxAgeSeconds ?? SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    return createErrorNextResponse(error);
  }
}