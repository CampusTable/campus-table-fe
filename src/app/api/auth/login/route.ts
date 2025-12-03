import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE, ErrorCode } from "@/shared/lib/errors/errorCodes";
import { createSession, SESSION_COOKIE_NAME, SessionData } from "@/shared/lib/session/sessionStore";
import { LoginRequest, LoginResponse, LoginUpstreamResponse } from "@/features/auth/types/loginTypes";
import { API_BASE_URL, isProduction, SESSION_TTL_SECONDS } from "@/shared/utils/env/envConfig";
import { handleErrorResponse } from "@/shared/lib/errors/errorResponse";
import { CustomError } from "@/shared/lib/errors/customError";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const loginRequest: LoginRequest = await request.json();

    const upstream: Response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    if (!upstream.ok) {
      await handleErrorResponse(upstream);
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

    if (error instanceof CustomError) {
      return NextResponse.json(
        {
          errorCode: error.errorCode,
          errorMessage: error.errorMessage,
        },
        { status: error.httpStatus },
      );
    }

    return NextResponse.json(
      {
        errorCode: ErrorCode.UNKNOWN_ERROR,
        errorMessage: ERROR_MESSAGE[ErrorCode.UNKNOWN_ERROR],
      },
      { status: 500 },
    );
  }
}