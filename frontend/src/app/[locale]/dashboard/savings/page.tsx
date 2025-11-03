import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '../../../../components/templates/DashboardLayout';
import { SavingsOverview } from '../../../../components/organisms/SavingsOverview';
import { mockAccounts, mockSavingsRate } from '../../../../features/dashboard/mocks';

interface SavingsPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SavingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Dashboard.savings' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('description'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function SavingsPage({ params }: SavingsPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const accounts = mockAccounts;
  const savingsRate = mockSavingsRate;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SavingsOverview 
          accounts={accounts}
          savingsRate={savingsRate}
        />
      </div>
    </DashboardLayout>
  );
}