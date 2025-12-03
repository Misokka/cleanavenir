import React from 'react';
import { Card } from '../atoms/Card';
import { Skeleton } from '../atoms/Skeleton';

export const OperationsHistorySkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton width="250px" height="32px" className="mb-2" />
        <Skeleton width="300px" height="16px" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton width="100px" height="16px" />
                <Skeleton variant="circular" width="32px" height="32px" />
              </div>
              <Skeleton width="120px" height="32px" />
              <Skeleton width="80px" height="14px" />
            </div>
          </Card>
        ))}
      </div>
      
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton width="80px" height="20px" />
            <Skeleton width="120px" height="32px" variant="rectangular" />
          </div>
          
          <div className="space-y-2">
            <Skeleton width="100px" height="16px" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} width="80px" height="36px" variant="rectangular" />
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton width="80px" height="16px" />
                <Skeleton width="100%" height="40px" variant="rectangular" />
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="space-y-1">
          <div className="grid grid-cols-4 gap-4 pb-3 border-b border-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="80px" height="16px" />
            ))}
          </div>
          
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 last:border-b-0">
              <Skeleton width="100px" height="16px" />
              <Skeleton width="80px" height="24px" variant="rectangular" />
              <Skeleton width="140px" height="16px" />
              <Skeleton width="90px" height="18px" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const TransferPageSkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Skeleton width="250px" height="32px" className="mb-2" />
        <Skeleton width="280px" height="16px" />
      </div>
      
      <Card>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton width="120px" height="20px" />
            <Skeleton width="100%" height="44px" variant="rectangular" />
          </div>
          
          <div className="space-y-2">
            <Skeleton width="150px" height="20px" />
            <Skeleton width="100%" height="44px" variant="rectangular" />
          </div>
          
          <div className="space-y-2">
            <Skeleton width="80px" height="20px" />
            <Skeleton width="100%" height="44px" variant="rectangular" />
          </div>
          
          <div className="space-y-2">
            <Skeleton width="100px" height="20px" />
            <Skeleton width="100%" height="88px" variant="rectangular" />
          </div>
          
          <Card className="bg-blue-50">
            <div className="space-y-3">
              <Skeleton width="140px" height="20px" />
              <div className="space-y-2">
                <Skeleton width="100%" height="16px" />
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
              </div>
            </div>
          </Card>
          
          <div className="flex justify-end space-x-3">
            <Skeleton width="100px" height="44px" variant="rectangular" />
            <Skeleton width="180px" height="44px" variant="rectangular" />
          </div>
        </div>
      </Card>
      
      <Card className="bg-yellow-50">
        <Skeleton width="100%" height="60px" />
      </Card>
    </div>
  );
};

export default OperationsHistorySkeleton;
