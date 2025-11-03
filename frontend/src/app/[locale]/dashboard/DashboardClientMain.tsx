'use client';

import React from 'react';
import { DashboardLayout } from '../../../components/templates/DashboardLayout';
import { DashboardHeader } from '../../../components/organisms/DashboardHeader';
import { DashboardAccountsOverview } from '../../../components/organisms/DashboardAccountsOverview';
import { RecentOperations } from '../../../components/organisms/RecentOperations';
import { SavingsOverview } from '../../../components/organisms/SavingsOverview';

interface DashboardClientMainProps {
  locale: string;
}

export const DashboardClientMain: React.FC<DashboardClientMainProps> = ({ locale }) => {
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

export default DashboardClientMain;