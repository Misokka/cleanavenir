'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Operation, formatCurrency, formatDate } from '../../features/dashboard/mocks';

interface RecentOperationsProps {
  operations: Operation[];
  limit?: number;
}

export const RecentOperations: React.FC<RecentOperationsProps> = ({ 
  operations,
  limit = 5 
}) => {
  const t = useTranslations('Dashboard');

  const displayOperations = operations.slice(0, limit);

  const getOperationIcon = (type: Operation['type']): string => {
    return type === 'credit' ? '' : '';
  };

  const getOperationColor = (type: Operation['type']): string => {
    return type === 'credit' ? 'text-green-600' : 'text-red-500';
  };

  const getAmountDisplay = (operation: Operation): string => {
    const sign = operation.type === 'credit' ? '+' : '';
    return `${sign}${formatCurrency(operation.amount)}`;
  };

  return (
    <div className="space-y-6">
      <Typography variant="h3" color="primary">
        {t('overview.recentOperations')}
      </Typography>

      {displayOperations.length > 0 ? (
        <Card>
          <div className="divide-y divide-gray-200">
            {displayOperations.map((operation) => (
              <div key={operation.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getOperationIcon(operation.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="body" className="font-medium text-gray-900 mb-1">
                        {operation.description}
                      </Typography>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(operation.date)}</span>
                        <span>•</span>
                        <span>{operation.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <Typography 
                      variant="body" 
                      className={`font-semibold ${getOperationColor(operation.type)}`}
                    >
                      {getAmountDisplay(operation)}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <Typography variant="h4" className="mb-2">
            {t('overview.noOperations')}
          </Typography>
          <Typography color="muted">
            {t('operations.recentTransactionsWillAppear')}
          </Typography>
        </Card>
      )}
    </div>
  );
};

export default RecentOperations;