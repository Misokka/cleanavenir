import React from 'react';
import { Card } from '../atoms/Card';
import { Skeleton } from '../atoms/Skeleton';

export const AccountListSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton width="120px" height="32px" />
        <Skeleton width="140px" height="40px" variant="rectangular" />
      </div>
      
      <Card>
        <div className="text-center space-y-2 py-4">
          <Skeleton width="200px" height="28px" className="mx-auto" />
          <Skeleton width="180px" height="40px" className="mx-auto" />
        </div>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Skeleton variant="circular" width="48px" height="48px" />
                  <div className="space-y-2">
                    <Skeleton width="100px" height="20px" />
                    <Skeleton width="140px" height="14px" />
                  </div>
                </div>
                <Skeleton width="100px" height="24px" />
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Skeleton width="100%" height="14px" />
                <div className="flex justify-between">
                  <Skeleton width="120px" height="20px" />
                  <Skeleton width="60px" height="20px" variant="rectangular" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AccountDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width="40px" height="20px" />
          <Skeleton width="200px" height="36px" />
          <Skeleton width="150px" height="16px" />
        </div>
        <div className="space-x-2 flex">
          <Skeleton width="100px" height="40px" variant="rectangular" />
          <Skeleton width="120px" height="40px" variant="rectangular" />
          <Skeleton width="100px" height="40px" variant="rectangular" />
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="text-center space-y-3 py-6">
          <Skeleton width="100px" height="16px" className="mx-auto bg-white/30" />
          <Skeleton width="220px" height="48px" className="mx-auto bg-white/40" />
          <Skeleton width="140px" height="14px" className="mx-auto bg-white/20" />
        </div>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center space-y-3 py-4">
              <Skeleton variant="circular" width="48px" height="48px" className="mx-auto" />
              <Skeleton width="100px" height="18px" className="mx-auto" />
              <Skeleton width="140px" height="14px" className="mx-auto" />
            </div>
          </Card>
        ))}
      </div>
      
      <Card>
        <div className="space-y-4">
          <Skeleton width="180px" height="24px" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton width="80px" height="14px" />
                <Skeleton width="100%" height="18px" />
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton width="180px" height="24px" />
            <Skeleton width="120px" height="32px" variant="rectangular" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex items-center space-x-3 flex-1">
                <Skeleton variant="circular" width="40px" height="40px" />
                <div className="space-y-2 flex-1">
                  <Skeleton width="160px" height="16px" />
                  <Skeleton width="120px" height="14px" />
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

export default AccountListSkeleton;
