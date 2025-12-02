import { createProxy } from "@/shared/lib/bff/proxy";
import { NextRequest } from "next/server";
import { ProxyContext } from "@/shared/lib/bff/proxyTypes";
import { API_BASE_URL } from "@/shared/utils/env/envConfig";

const proxy = createProxy({
  backendBaseUrl: API_BASE_URL,
  // promoteCookieToAuth: { cookieName: 'accessToken', overwriteIfExists: false },
  excludedRequestHeaders: ['content-length'],
  useSessionAuth: true,
  sessionCookieName: "sid",
});

export async function GET(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function POST(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function PUT(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}

export async function OPTIONS(req: NextRequest, ctx: ProxyContext): Promise<Response> {
  return proxy(req, ctx);
}