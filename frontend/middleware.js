import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export function middleware(request) {
  console.log("\n--- Middleware Execution Started ---");
  console.log("Request URL:", request.url);
  
  // Log all request headers
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  console.log("Request Headers:", JSON.stringify(headers, null, 2));

  // Get cookies using cookies() function
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  console.log("All Cookies:", allCookies);

  // Get specific cookie
  const token = cookieStore.get('_api_token');
  console.log("Token Cookie:", token);

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};