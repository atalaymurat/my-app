import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile"];
  const isProduction = process.env.NODE_ENV === "production";
  console.log(`Middleware: Protected path accessed - ${path}`);

  // Skip middleware for non-protected paths
  if (!protectedPaths.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Security logging
  console.log(`[Middleware] Protected route accessed: ${path}`, {
    ip: request.headers.get("x-forwarded-for"),
    ua: request.headers.get("user-agent"),
    time: new Date().toISOString(),
  });

  // Get session cookie - using __Host- prefix in production for added security
  const cookieName = isProduction ? "__Host-session" : "session";
  const sessionCookie = request.cookies.get(cookieName);

  if (!sessionCookie) {
    console.warn(`[Middleware] Unauthorized access attempt to ${path}`);
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("callbackUrl", path);

    // Security headers for the redirect response
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");

    return response;
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*", // Protect all subpaths
    "/dashboard/:path*", // Example additional protected path
  ],
};
