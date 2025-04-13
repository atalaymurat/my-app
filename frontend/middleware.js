import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", request.url);
  console.log("Request Headers:", Object.fromEntries(request.headers.entries()));

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile"];
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction ? "token" : "token";

  // Debug all available cookies
  const allCookies = request.cookies.getAll();
  console.log("All cookies in middleware:", allCookies);

  // Skip middleware for non-protected paths
  if (!protectedPaths.some((p) => path.startsWith(p))) {
    const response = NextResponse.next();
    // Add CORS headers to all responses
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
    return response;
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
    
    // Ensure CORS headers
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
    return response;
  }

  const response = NextResponse.next();
  
  // Add security and CORS headers
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/api/:path*"],
};