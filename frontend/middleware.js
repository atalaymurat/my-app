import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const protectedPaths = ['/profile'];
  
  if (!protectedPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('from', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile'],
};