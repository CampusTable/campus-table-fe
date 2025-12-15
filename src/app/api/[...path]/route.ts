import { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/shared/lib/session/sessionStore";
import { createGateway } from "@/shared/lib/bff/gateway";
import { GatewayContext } from "@/shared/lib/bff/gatewayTypes";
import { serverEnv } from "@/shared/config/env.server";

const gateway = createGateway({
  backendBaseUrl: serverEnv.API_BASE_URL,
  // promoteCookieToAuth: { cookieName: 'accessToken', overwriteIfExists: false },
  excludedRequestHeaders: ['content-length'],
  authType: "session",
  requireAuth: true,
  sessionCookieName: SESSION_COOKIE_NAME,
});

export async function GET(req: NextRequest, ctx: GatewayContext): Promise<Response> {
  return gateway(req, ctx);
}

export async function POST(req: NextRequest, ctx: GatewayContext): Promise<Response> {
  return gateway(req, ctx);
}

export async function PUT(req: NextRequest, ctx: GatewayContext): Promise<Response> {
  return gateway(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: GatewayContext): Promise<Response> {
  return gateway(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: GatewayContext): Promise<Response> {
  return gateway(req, ctx);
}

export async function OPTIONS(req: NextRequest, ctx: GatewayContext): Promise<Response> {
  return gateway(req, ctx);
}