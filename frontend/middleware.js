import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", request.url);

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile"];
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction ? "token" : "token";

  // Get cookies from headers
  const cookieHeader = request.headers.get('cookie');
  console.log("Cookie Header:", cookieHeader);

  // Parse cookies
  const cookies = cookieHeader ? cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {}) : {};

  console.log("Parsed cookies:", cookies);

  // Skip middleware for non-protected paths
  if (!protectedPaths.some((p) => path.startsWith(p))) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
    return response;
  }

  try {
    // Get token from parsed cookies
    const token = cookies[cookieName];
    console.log("Token check:", {
      cookieName,
      exists: !!token,
      value: token ? "[redacted]" : null
    });
    
    if (!token) {
      console.warn(`Unauthorized access to ${path} - No token found`);
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      console.log("Token verified for user:", {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      });

      // Token geçerli, isteği devam ettir
      const response = NextResponse.next();
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
      return response;
    } catch (error) {
      console.warn(`Invalid token for ${path}:`, error.message);
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Middleware error:", error);
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/profile/:path*", "/api/:path*"],
};