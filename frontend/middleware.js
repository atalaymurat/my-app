// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  // Burada token kontrolü yapıyoruz
  const token = req.cookies.get('token');

  if (!token) {
    // Eğer token yoksa kullanıcıyı login sayfasına yönlendiriyoruz
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextResponse.next();  // İstek geçerli, işlemin devam etmesine izin veriyoruz
}

export const config = {
  matcher: ['/profile/'],  // Bu middleware sadece profile yoluna uygulanacak
};
