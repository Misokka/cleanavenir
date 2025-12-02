import React from 'react';
import { Card } from '../atoms/Card';
import { Skeleton } from '../atoms/Skeleton';

export const SavingDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width="60px" height="20px" />
          <Skeleton width="220px" height="36px" />
          <Skeleton width="180px" height="16px" />
        </div>
        <Skeleton width="120px" height="40px" variant="rectangular" />
      </div>
      
      <Card className="bg-gradient-to-r from-green-500 to-teal-600">
        <div className="text-center space-y-3 py-6">
          <Skeleton width="120px" height="16px" className="mx-auto bg-white/30" />
          <Skeleton width="240px" height="48px" className="mx-auto bg-white/40" />
          <div className="flex items-center justify-center space-x-4 pt-2">
            <Skeleton width="100px" height="16px" className="bg-white/30" />
            <Skeleton width="100px" height="16px" className="bg-white/30" />
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="space-y-4">
          <Skeleton width="200px" height="24px" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center py-3 border border-gray-200 rounded-lg space-y-2">
                <Skeleton width="80px" height="14px" className="mx-auto" />
                <Skeleton width="100px" height="28px" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="space-y-4">
          <Skeleton width="200px" height="24px" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton width="100px" height="14px" />
                <Skeleton width="100%" height="20px" />
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="space-y-4">
          <Skeleton width="180px" height="24px" />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circular" width="48px" height="48px" />
              <div className="space-y-2">
                <Skeleton width="140px" height="18px" />
                <Skeleton width="200px" height="14px" />
              </div>
            </div>
            <Skeleton width="120px" height="32px" variant="rectangular" />
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton width="200px" height="24px" />
            <Skeleton width="100px" height="32px" variant="rectangular" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="space-y-1 flex-1">
                <Skeleton width="180px" height="16px" />
                <Skeleton width="120px" height="14px" />
              </div>
              <Skeleton width="80px" height="20px" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const SavingListSkeleton: React.FC = () => {
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
          {[1, 2, 3, 4].map((i) => (
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
                <div className="pt-2 border-t border-gray-100">
                  <Skeleton width="140px" height="32px" variant="rectangular" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavingDetailSkeleton;
