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
        <div className="flex gap-4">
          <Link href={`/${locale}/dashboard/operations/transfer`} className="flex-1">
            <Button variant="primary" className="w-full">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Faire un virement
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/beneficiaries`} className="flex-1">
            <Button variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Mes bénéficiaires
            </Button>
          </Link>
        </div>
        
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