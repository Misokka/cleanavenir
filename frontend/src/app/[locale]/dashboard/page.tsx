import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '../../../components/templates/DashboardLayout';
import { DashboardAccountsOverview } from '../../../components/organisms/DashboardAccountsOverview';
import { RecentOperations } from '../../../components/organisms/RecentOperations';
import { 
  mockAccounts, 
  mockOperations, 
  getRecentOperations 
} from '../../../features/dashboard/mocks';

interface DashboardPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Dashboard.overview' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('description'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const accounts = mockAccounts;
  const recentOperations = getRecentOperations(mockOperations, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardAccountsOverview 
          accounts={accounts}
          showTotal={true}
          showViewAll={true}
        />
        
        <RecentOperations 
          operations={recentOperations}
          limit={5}
        />
      </div>
    </DashboardLayout>
  );
}