'use client';

import Link from 'next/link';
import { useEffect } from 'react';

const translations = {
  fr: {
    title: 'Erreur interne du serveur',
    description: "Une erreur inattendue s'est produite. Nos équipes ont été notifiées et travaillent à résoudre le problème.",
    backHome: "Retour à l'accueil",
    retry: 'Réessayer',
  },
  en: {
    title: 'Internal server error',
    description: 'An unexpected error occurred. Our teams have been notified and are working to resolve the issue.',
    backHome: 'Back to home',
    retry: 'Try again',
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Extraire la locale directement depuis window.location (côté client)
  const locale = typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'fr';
  const t = translations[locale];

  useEffect(() => {
    // Log l'erreur vers un service de monitoring
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <html lang={locale}>
      <body className="bg-gray-50">
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-9xl font-bold text-red-600">500</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">{t.title}</h2>
          <p className="text-gray-600 mt-2 text-center max-w-md">{t.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={reset}
              className="px-6 py-3 bg-clean-dark text-white rounded-lg hover:bg-clean-secondary transition-colors"
            >
              {t.retry}
            </button>
            <Link 
              href={`/${locale}`}
              className="px-6 py-3 bg-clean-dark text-white rounded-lg hover:bg-clean-secondary transition-colors text-center"
            >
              {t.backHome}
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 text-xs text-left bg-gray-100 p-4 rounded overflow-auto max-w-2xl">
              {error.message}
            </pre>
          )}
        </main>
      </body>
    </html>
  );
}
