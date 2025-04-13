import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", request.url);
  console.log("Request Headers:", JSON.stringify(request, null, 2));

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};