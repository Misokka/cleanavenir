'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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