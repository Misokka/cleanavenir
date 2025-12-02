import React from 'react';
import { Card } from '../atoms/Card';
import { Skeleton } from '../atoms/Skeleton';

export const DashboardHeaderSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow-md px-6 py-4 rounded-xl mb-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton width="200px" height="24px" />
          <Skeleton width="150px" height="16px" />
        </div>
        <div className="text-right hidden md:block space-y-2">
          <Skeleton width="80px" height="14px" />
          <Skeleton width="180px" height="16px" />
        </div>
      </div>
    </div>
  );
};

export const AccountsOverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton width="180px" height="28px" />
        <div className="flex gap-2">
          <Skeleton width="120px" height="36px" variant="rectangular" />
          <Skeleton width="100px" height="36px" variant="rectangular" />
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="text-center space-y-2">
          <Skeleton width="120px" height="16px" className="mx-auto bg-white/30" />
          <Skeleton width="180px" height="36px" className="mx-auto bg-white/40" />
          <Skeleton width="150px" height="14px" className="mx-auto bg-white/20" />
        </div>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton width="100px" height="20px" />
                  <Skeleton width="140px" height="14px" />
                </div>
                <Skeleton width="80px" height="24px" />
              </div>
              <div className="pt-3 border-t border-gray-100">
                <Skeleton width="100%" height="14px" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const RecentOperationsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton width="180px" height="24px" />
        <Skeleton width="150px" height="32px" variant="rectangular" />
      </div>
      
      <Card>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3 flex-1">
                <Skeleton variant="circular" width="40px" height="40px" />
                <div className="space-y-2 flex-1">
                  <Skeleton width="150px" height="16px" />
                  <Skeleton width="100px" height="14px" />
                </div>
              </div>
              <Skeleton width="80px" height="20px" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const SavingsOverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton width="150px" height="28px" />
        <Skeleton width="140px" height="36px" variant="rectangular" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-green-50">
          <div className="text-center space-y-2">
            <Skeleton width="100px" height="14px" className="mx-auto" />
            <Skeleton width="80px" height="32px" className="mx-auto" />
            <Skeleton width="80px" height="14px" className="mx-auto" />
          </div>
        </Card>
        <Card className="bg-blue-50">
          <div className="text-center space-y-2">
            <Skeleton width="120px" height="14px" className="mx-auto" />
            <Skeleton width="100px" height="20px" className="mx-auto" />
          </div>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Skeleton width="200px" height="24px" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton width="120px" height="20px" />
                    <Skeleton width="80px" height="16px" />
                  </div>
                  <Skeleton width="90px" height="24px" />
                </div>
                <div className="space-y-2">
                  <Skeleton width="100%" height="14px" />
                  <Skeleton width="100%" height="14px" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <DashboardHeaderSkeleton />
      <AccountsOverviewSkeleton />
      <RecentOperationsSkeleton />
      <SavingsOverviewSkeleton />
    </div>
  );
};

export default DashboardSkeleton;
