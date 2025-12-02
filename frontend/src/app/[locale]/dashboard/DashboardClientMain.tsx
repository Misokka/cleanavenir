'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/templates/DashboardLayout';
import { DashboardHeader } from '../../../components/organisms/DashboardHeader';
import { DashboardAccountsOverview } from '../../../components/organisms/DashboardAccountsOverview';
import { RecentOperations } from '../../../components/organisms/RecentOperations';
import { SavingsOverview } from '../../../components/organisms/SavingsOverview';
import { Button } from '../../../components/atoms/Button';
import { DashboardSkeleton } from '../../../components/molecules/DashboardSkeleton';
import { useAuth } from '../../../contexts/AuthProvider';

interface DashboardClientMainProps {
  locale: string;
}

export const DashboardClientMain: React.FC<DashboardClientMainProps> = ({ locale }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className="space-y-8">
        <DashboardAccountsOverview 
          showTotal={true}
          showViewAll={true}
        />
        
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Opérations récentes</h3>
          <Link href={`/${locale}/dashboard/operations/history`}>
            <Button variant="outline" size="sm">
              Historique complet
            </Button>
          </Link>
        </div>
        
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

export default DashboardClientMain;