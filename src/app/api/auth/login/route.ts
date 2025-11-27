import { NextRequest, NextResponse } from "next/server";
import { LoginRequest } from "@/features/auth/api/loginApi";
import { API_BASE_URL } from "@/shared/lib/types/envUrls";
import { ErrorCode } from "@/shared/lib/errors/errorCodes";

interface LoginApiResponse {
  studentNumber: string;
  studentName: string;
  newUser: boolean;
  accessToken: string;
}

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
      return NextResponse.json(await upstream.json());
    }

    const responseBody: LoginApiResponse = await upstream.json();

    // 엑세스 토큰 쿠키 저장
    const response: NextResponse = NextResponse.json(responseBody);

    response.cookies.set("accessToken", responseBody.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // production 환경에서만 'secure = true'
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1시간
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