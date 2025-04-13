import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", request.url);
  
  // Log all request headers
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  console.log("Request Headers:", JSON.stringify(headers, null, 2));

  // Get cookies from headers
  const cookieHeader = request.headers.get('cookie');
  console.log("Cookie Header:", cookieHeader);



  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};