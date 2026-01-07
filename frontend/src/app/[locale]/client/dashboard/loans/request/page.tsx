import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { LoanRequestForm } from '@/components/organisms/LoanRequestForm';
import { Typography } from '@/components/atoms/Typography';
import Link from 'next/link';

interface RequestPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RequestPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Loans.request' });
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function RequestPage({ params }: RequestPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Loans.request' });
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">{t('title')}</Typography>
            <Typography variant="body" color="muted">{t('description')}</Typography>
          </div>
          <Link 
            href={`/${locale}/client/dashboard/loans/simulate`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {t('simulateFirst')}
          </Link>
        </div>

        <div className="max-w-2xl">
          <LoanRequestForm />
        </div>

        <div className="max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Typography variant="h4" className="mb-3 text-blue-900">{t('process.title')}</Typography>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>{t('process.step1')}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>{t('process.step2')}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>{t('process.step3')}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>{t('process.step4')}</span>
            </li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
