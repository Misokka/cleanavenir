'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const translations = {
  fr: {
    title: 'Page non trouvée',
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
    backHome: "Retour à l'accueil",
  },
  en: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to home',
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname?.startsWith('/en') ? 'en' : 'fr';
  const t = translations[locale];

  return (
    <html lang={locale}>
      <body className="bg-gray-50">
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-9xl font-bold text-clean-dark">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">{t.title}</h2>
          <p className="text-gray-600 mt-2 text-center max-w-md">{t.description}</p>
          <Link 
            href={`/${locale}`}
            className="mt-8 px-6 py-3 bg-clean-dark text-white rounded-lg hover:bg-clean-secondary transition-colors"
          >
            {t.backHome}
          </Link>
        </main>
      </body>
    </html>
  );
}
