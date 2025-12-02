import { NextRequest, NextResponse } from "next/server";
import { deleteSession, SESSION_COOKIE_NAME } from "@/shared/lib/session/sessionStore";
import { isProduction } from "@/shared/utils/env/envConfig";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sessionId: string | undefined = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId && sessionId.length > 0) {
    await deleteSession(sessionId);
  }
  const response: NextResponse = NextResponse.json(null);

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: isProduction(),
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    domain: isProduction() ? "campustable.shop" : "",
    maxAge: 0
  });

  return response;
}