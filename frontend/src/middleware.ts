import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr'
});

export default function middleware(request: NextRequest) {
  // Appliquer uniquement le middleware d'internationalisation pour le moment
  // La protection des routes sera gérée côté composant
  return intlMiddleware(request);
}
 
export const config = {
  matcher: ['/', '/(fr|en)/:path*']
};