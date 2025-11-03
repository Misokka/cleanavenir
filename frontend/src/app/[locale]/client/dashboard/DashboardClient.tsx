'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../contexts/AuthProvider';
import { useLogout } from '../../../../features/auth/useLogin';
import { DashboardLayout } from '../../../../components/templates/DashboardLayout';
import { DashboardAccountsOverview } from '../../../../components/organisms/DashboardAccountsOverview';
import { RecentOperations } from '../../../../components/organisms/RecentOperations';
import { Typography } from '../../../../components/atoms/Typography';
import { Button } from '../../../../components/atoms/Button';
import { Card } from '../../../../components/atoms/Card';
import { 
  mockAccounts, 
  mockOperations, 
  getRecentOperations 
} from '../../../../features/dashboard/mocks';

interface DashboardClientProps {
  locale: string;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ locale }) => {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const tHeader = useTranslations('Dashboard.header');
  const { user, loading, error, isAuthenticated } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

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

  const accounts = mockAccounts;
  const recentOperations = getRecentOperations(mockOperations, 5);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Typography variant="h2" className="mb-2">
            {tHeader('greeting', { firstName: user.firstname })}
          </Typography>
          <Typography variant="body" color="muted">
            {tHeader('welcome')}
          </Typography>
        </div>
        
        <Button
          variant="secondary"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="flex items-center space-x-2"
        >
          {logoutLoading ? (
            <Typography variant="caption">
              Déconnexion...
            </Typography>
          ) : (
            <Typography variant="caption">
              {t('navigation.logout')}
            </Typography>
          )}
        </Button>
      </div>

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
};

export default DashboardClient;