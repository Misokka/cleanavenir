'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../contexts/AuthProvider';
import { DashboardLayout } from '../../../../components/templates/DashboardLayout';
import { DashboardHeader } from '../../../../components/organisms/DashboardHeader';
import { DashboardAccountsOverview } from '../../../../components/organisms/DashboardAccountsOverview';
import { RecentOperations } from '../../../../components/organisms/RecentOperations';
import { SavingsOverview } from '../../../../components/organisms/SavingsOverview';
import { Typography } from '../../../../components/atoms/Typography';
import { Button } from '../../../../components/atoms/Button';
import { Card } from '../../../../components/atoms/Card';

interface DashboardClientProps {
  locale: string;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ locale }) => {
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useAuth();
  const t = useTranslations('Dashboard.accounts.actions');
  const tBeneficiaries = useTranslations('Beneficiaries');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [loading, isAuthenticated, router, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-clean-light flex items-center justify-center">
        <Card className="p-8 text-center">
          <Typography variant="body">
            Chargement...
          </Typography>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-clean-light flex items-center justify-center">
        <Card className="p-8 text-center space-y-4">
          <Typography variant="body" color="muted">
            Erreur d'authentification
          </Typography>
          <Button 
            variant="primary" 
            onClick={() => router.push(`/${locale}/auth/login`)}
          >
            Se reconnecter
          </Button>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="space-y-8">
        <div className="flex gap-4">
          <Link href={`/${locale}/dashboard/operations/transfer`} className="flex-1">
            <Button variant="primary" className="w-full">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {t('makeTransfer')}
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/beneficiaries`} className="flex-1">
            <Button variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {tBeneficiaries('title')}
            </Button>
          </Link>
        </div>
        
        <DashboardAccountsOverview 
          showTotal={true}
          showViewAll={true}
        />
        
        <RecentOperations 
          limit={5}
        />
        
        <SavingsOverview 
          showCreateButton={true}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardClient;