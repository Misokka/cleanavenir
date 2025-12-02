'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../../components/templates/DashboardLayout';
import { SavingsOverview } from '../../../../components/organisms/SavingsOverview';
import { SavingListSkeleton } from '../../../../components/molecules/SavingSkeleton';
import { useAuth } from '../../../../contexts/AuthProvider';

interface SavingsPageClientProps {
  readonly locale: string;
}

export function SavingsPageClient({ locale }: SavingsPageClientProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [loading, isAuthenticated, router, locale]);

  if (loading) {
    return (
      <DashboardLayout>
        <SavingListSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SavingsOverview 
          showCreateButton={true}
        />
      </div>
    </DashboardLayout>
  );
}

export default SavingsPageClient;
