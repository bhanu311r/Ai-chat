import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDevelopmentEnvironment } from "./lib/constants";
import { ChatbotError } from "./lib/errors";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ping") {
    return new Response("pong", { status: 200 });
  }

  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const authPage = pathname === "/login" || pathname === "/register";
  if (token?.type === "regular") {
    return authPage
      ? NextResponse.redirect(new URL(`${base}/`, request.url))
      : NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return new ChatbotError("unauthorized:auth").toResponse();
  }

  if (!authPage) {
    return NextResponse.redirect(new URL(`${base}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/chat/:id",
    "/api/:path*",
    "/login",
    "/register",

    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
