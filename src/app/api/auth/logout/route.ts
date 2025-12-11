import { NextRequest, NextResponse } from "next/server";
import { deleteSession, SESSION_COOKIE_NAME } from "@/shared/lib/session/sessionStore";
import { createErrorNextResponse } from "@/shared/lib/errors/errorResponse";
import { nvl } from "@/shared/utils/string/nvl";
import { isProduction } from "@/shared/config/env.client";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const sessionId: string = nvl(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    if (!sessionId) {
      await deleteSession(sessionId);
    }
    const response: NextResponse = NextResponse.json(null);

    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: isProduction(),
      secure: isProduction(),
      sameSite: "strict",
      path: "/",
      domain: isProduction() ? "campustable.shop" : undefined,
      maxAge: 0
    });

    return response;
  } catch (error) {
    return createErrorNextResponse(error);
  }
}