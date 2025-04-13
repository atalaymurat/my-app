import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", request.url);
  console.log("Request Headers:", Object.fromEntries(request.headers.entries()));

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile"];
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction ? "session" : "session"

  // Debug all available cookies
  const allCookies = request.cookies.getAll();
  console.log("All cookies in middleware:", allCookies);

  // Skip middleware for non-protected paths
  if (!protectedPaths.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get(cookieName)?.value;
  console.log("Session cookie check:", {
    name: cookieName,
    exists: !!sessionCookie,
    value: sessionCookie ? "[redacted]" : null
  });

  if (!sessionCookie) {
    console.warn(`Unauthorized access to ${path}`);
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    
    const response = NextResponse.redirect(loginUrl);
    
    // Ensure CORS headers if needed
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  
  return response;
}

export const config = {
  matcher: ["/profile/:path*"],
};