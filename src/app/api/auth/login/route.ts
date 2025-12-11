import { NextRequest, NextResponse } from "next/server";
import { createSession, SESSION_COOKIE_NAME, SessionData } from "@/shared/lib/session/sessionStore";
import { LoginApiResponse, LoginRequest, LoginResponse } from "@/features/auth/types/loginTypes";
import { createErrorNextResponse } from "@/shared/lib/errors/errorResponse";
import { postFetchServer } from "@/shared/lib/bff/fetchServer";
import { isProduction } from "@/shared/config/env.client";
import { serverEnv } from "@/shared/config/env.server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const loginRequest: LoginRequest = await request.json();

    const upstreamBody: LoginApiResponse = await postFetchServer<LoginApiResponse>(request, "/api/auth/login", loginRequest, {
      requireAuth: false,
      authType: "none",
    });

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
      maxAge: sessionData.maxAgeSeconds ?? serverEnv.SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    return createErrorNextResponse(error);
  }
}