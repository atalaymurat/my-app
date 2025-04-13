import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", JSON.stringify(request));
  console.log(
    "Request Headers:",
    Object.fromEntries(request.headers.entries())
  );

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile"];
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction ? "session" : "session";

  // Debug all available cookies
  const allCookies = request.cookies.getAll();
  console.log("All cookies in middleware:", allCookies);

  // Alternative way to access
  const cookieHeader = request.headers.get("cookie");
  console.log("Raw cookie header:", cookieHeader);

  // Skip middleware for non-protected paths
  if (!protectedPaths.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get(cookieName)?.value;
  console.log("Session cookie check:", {
    name: cookieName,
    exists: !!sessionCookie,
    value: sessionCookie ? "[redacted]" : null,
  });

  if (!sessionCookie) {
    console.warn(`Unauthorized access to ${path}`);
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("callbackUrl", path);

    const response = NextResponse.redirect(loginUrl);

    return response;
  }

  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ["/profile/:path*"],
};
