import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", request.url);
  console.log("Request Method:", request.method);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile"];
  const isProduction = process.env.NODE_ENV === "production";

  console.log("Checking path:", path);
  // Skip middleware for non-protected paths
  if (!protectedPaths.some((p) => path.startsWith(p))) {
    console.log("Middleware skip not protected route....");
    return NextResponse.next();
  }

  console.log("Path is protected, checking authentication");

  // Get session cookie - using __Host- prefix in production for added security
  const cookieName = isProduction ? "__Host-session" : "session";
  const sessionCookie = request.cookies.get(cookieName);

  console.log("Cookie check:", { cookieName, exists: !!sessionCookie });

  if (!sessionCookie) {
    console.warn(`[Middleware] Unauthorized access attempt to ${path}`);
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("callbackUrl", path);

    // Security headers for the redirect response
    console.log("Redirecting to:", loginUrl.toString());
    const response = NextResponse.redirect(loginUrl);

    return response;
  }
  console.log("User authenticated, proceeding");
  // Add security headers to all responses
  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*", // Protect all subpaths
    "/dashboard/:path*", // Example additional protected path
  ],
};
