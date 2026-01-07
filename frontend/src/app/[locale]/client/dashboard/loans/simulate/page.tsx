import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { LoanSimulator } from '@/components/organisms/LoanSimulator';
import { Typography } from '@/components/atoms/Typography';

interface SimulatePageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SimulatePageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Loans.simulate' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function SimulatePage({ params }: SimulatePageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Loans.simulate' });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Typography variant="h2" className="mb-2">
            {t('title')}
          </Typography>
          <Typography variant="body" color="muted">
            {t('description')}
          </Typography>
        </div>

        <LoanSimulator />
      </div>
    </DashboardLayout>
  );
}
