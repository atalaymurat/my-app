import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;
  
  // Define which paths are protected (require authentication)
  const protectedPaths = ['/profile', '/dashboard', '/settings'];
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
  
  // If it's not a protected path, allow the request
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Check for the session cookie
  const sessionCookie = request.cookies.get('session');
  
  // If there's no session cookie and the path is protected, redirect to login
  if (!sessionCookie && isProtectedPath) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth pages (we don't want to redirect from auth pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
};