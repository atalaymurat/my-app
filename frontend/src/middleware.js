import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  console.log("Token:", token);

  // If there's no token, redirect to login

  // If there's a token, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
  ],
}; 