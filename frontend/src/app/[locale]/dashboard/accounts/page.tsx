import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '../../../../components/templates/DashboardLayout';
import { DashboardAccountsOverview } from '../../../../components/organisms/DashboardAccountsOverview';
import { mockAccounts } from '../../../../features/dashboard/mocks';

interface AccountsPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AccountsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Dashboard.accounts' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('description'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function AccountsPage({ params }: AccountsPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const accounts = mockAccounts;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardAccountsOverview 
          accounts={accounts}
          showTotal={false}
          showViewAll={false}
        />
      </div>
    </DashboardLayout>
  );
}