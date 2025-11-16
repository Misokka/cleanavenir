'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../../components/templates/DashboardLayout';
import { DashboardAccountsOverview } from '../../../../components/organisms/DashboardAccountsOverview';
import { useAuth } from '../../../../contexts/AuthProvider';

interface AccountsPageClientProps {
  readonly locale: string;
}

function AccountsPageClient({ locale }: AccountsPageClientProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [loading, isAuthenticated, router, locale]);

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardAccountsOverview 
          showTotal={false}
          showViewAll={false}
        />
      </div>
    </DashboardLayout>
  );
}

export default AccountsPageClient;