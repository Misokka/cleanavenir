import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-bold text-clean-dark">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">{t('title')}</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">{t('description')}</p>
      <Link href="/" className="mt-8">
        <Button variant="primary" size="lg">
          {t('backHome')}
        </Button>
      </Link>
    </main>
  );
}
