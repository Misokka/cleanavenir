'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/atoms/Card';

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'fr';

  React.useEffect(() => {
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center py-12 px-6">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <Typography variant="h1" className="mb-4 text-gray-900">
            Oups ! Une erreur est survenue
          </Typography>

          <Typography variant="body" color="muted" className="mb-6 max-w-md mx-auto">
            {locale === 'fr'
              ? "Nous sommes désolés, une erreur inattendue s'est produite. Notre équipe technique a été notifiée et travaille à résoudre le problème."
              : "We're sorry, an unexpected error occurred. Our technical team has been notified and is working to resolve the issue."}
          </Typography>

          {process.env.NODE_ENV === 'development' && error.message && (
            <Card className="bg-gray-50 border border-gray-200 p-4 mb-6 text-left">
              <Typography variant="caption" className="font-mono text-red-600 break-all">
                {error.message}
              </Typography>
              {error.digest && (
                <Typography variant="caption" color="muted" className="mt-2 font-mono">
                  Error ID: {error.digest}
                </Typography>
              )}
            </Card>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button
              variant="primary"
              onClick={reset}
              className="w-full sm:w-auto"
            >
              {locale === 'fr' ? '🔄 Réessayer' : '🔄 Try again'}
            </Button>
            <Link href={`/${locale}/dashboard`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                {locale === 'fr' ? '🏠 Retour au dashboard' : '🏠 Back to dashboard'}
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Typography variant="caption" color="muted">
              {locale === 'fr'
                ? "Si le problème persiste, contactez notre "
                : "If the problem persists, contact our "}
              <Link href={`/${locale}/support`} className="text-blue-600 hover:text-blue-800 underline">
                {locale === 'fr' ? 'support technique' : 'technical support'}
              </Link>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
}
