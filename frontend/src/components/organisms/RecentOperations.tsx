'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useGetRecentOperations } from '../../features/operations/useGetRecentOperations';
import { OperationDTO, OperationKind } from '../../infrastructure/web/types';

interface RecentOperationsProps {
  limit?: number;
}

export const RecentOperations: React.FC<RecentOperationsProps> = ({ 
  limit = 5 
}) => {
  const t = useTranslations('Dashboard.overview');
  const locale = useLocale();
  const { operations, loading, error, refetch } = useGetRecentOperations(limit);

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getOperationIcon = (kind: OperationKind): string => {
    return kind === 'CREDIT' ? '💰' : '💸';
  };

  const getOperationColor = (kind: OperationKind): string => {
    return kind === 'CREDIT' ? 'text-green-600' : 'text-red-500';
  };

  const getAmountDisplay = (operation: OperationDTO): string => {
    const sign = operation.kind === 'CREDIT' ? '+' : '-';
    return `${sign}${formatCurrency(operation.amount, operation.currency)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <Card>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Typography variant="h3" color="primary">
          {t('recentOperations')}
        </Typography>
        
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <div className="text-6xl mb-4"></div>
          <Typography variant="h4" className="mb-2 text-red-700">
            Erreur de chargement
          </Typography>
          <Typography color="muted" className="mb-4">
            {error}
          </Typography>
          <Button variant="primary" onClick={refetch}>
            {t('retry')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h3" color="primary">
          {t('recentOperations')}
        </Typography>
        <Link href={`/${locale}/dashboard/operations`}>
          <Button variant="outline" size="sm">
            {t('viewAll')}
          </Button>
        </Link>
      </div>

      {operations && operations.length > 0 ? (
        <Card>
          <div className="divide-y divide-gray-200">
            {operations.map((operation) => (
              <div key={operation.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getOperationIcon(operation.kind)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="body" className="font-medium text-gray-900 mb-1">
                        {operation.label}
                      </Typography>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(operation.createdAt)}</span>
                        <span>•</span>
                        <span className={`capitalize ${operation.kind === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {operation.kind === 'CREDIT' ? 'Crédit' : 'Débit'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <Typography 
                      variant="body" 
                      className={`font-semibold ${getOperationColor(operation.kind)}`}
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
            {t('noOperations')}
          </Typography>
          <Typography color="muted">
            Vos dernières transactions apparaîtront ici
          </Typography>
        </Card>
      )}
    </div>
  );
};

export default RecentOperations;