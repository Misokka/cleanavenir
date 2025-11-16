import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr'
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Routes publiques (accessibles sans authentification)
  const publicPaths = ['/auth/login', '/auth/register', '/'];
  const isPublicPath = publicPaths.some(path => 
    pathname.includes(path)
  );
  
  // Vérifier la présence du token (dans les cookies ou localStorage via header)
  const token = request.cookies.get('accessToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Si l'utilisateur n'est pas authentifié et tente d'accéder à une route protégée
  if (!isPublicPath && !token) {
    const locale = pathname.split('/')[1] || 'fr';
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si l'utilisateur est authentifié et tente d'accéder à login/register, rediriger vers dashboard
  if (isPublicPath && token && (pathname.includes('/login') || pathname.includes('/register'))) {
    const locale = pathname.split('/')[1] || 'fr';
    return NextResponse.redirect(new URL(`/${locale}/client/dashboard`, request.url));
  }

  // Appliquer le middleware d'internationalisation
  return intlMiddleware(request);
}
 
export const config = {
  matcher: ['/', '/(fr|en)/:path*']
};