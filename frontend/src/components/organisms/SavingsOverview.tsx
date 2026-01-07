'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { CreateSavingModal } from '../molecules/CreateSavingModal';
import { useGetSavingsNew } from '../../features/savings/useGetSavings';
import { SavingDTO } from '../../infrastructure/web/services/savingService';

interface SavingsOverviewProps {
  showCreateButton?: boolean;
}

export const SavingsOverview: React.FC<SavingsOverviewProps> = ({ 
  showCreateButton = true
}) => {
  const t = useTranslations('Dashboard.savings');
  const locale = useLocale();
  const { savings, loading: savingsLoading, refetch: refetchSavings } = useGetSavingsNew();
  // const { currentRate, loading: rateLoading, error: rateError, refetch: refetchRate } = useCurrentSavingRateNew();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const loading = savingsLoading // || rateLoading;
  // const error = savingsError // || rateError;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
          {showCreateButton && (
            <div className="h-10 bg-gray-200 rounded animate-pulse w-40"></div>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="space-y-6">
  //       <Typography variant="h3" color="primary">
  //         {t('title')}
  //       </Typography>
        
  //       <Card className="text-center py-12 border-red-200 bg-red-50">
  //         <div className="text-6xl mb-4"></div>
  //         <Typography variant="h4" className="mb-2 text-red-700">
  //           Erreur de chargement
  //         </Typography>
  //         <Typography color="muted" className="mb-4">
  //           {error}
  //         </Typography>
  //         <div className="space-x-2">
  //           <Button variant="primary" onClick={refetchSavings}>
  //             {t('retrySaving')}
  //           </Button>
  //           <Button variant="secondary" onClick={refetchRate}>
  //             {t('retryRate')}
  //           </Button>
  //         </div>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h3" color="primary">
          {t('title')}
        </Typography>
        {showCreateButton && (
          <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
            {t('openAccount')}
          </Button>
        )}
      </div>

      {/* {currentRate && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="text-center bg-green-50 border-green-200">
            <Typography variant="caption" color="muted" className="mb-2">
              {t('currentRate')}
            </Typography>
            <Typography variant="h2" className="text-green-600 font-bold">
              {currentRate.rate}%
            </Typography>
            <Typography variant="caption" color="muted" className="mt-1">
              {t('perYear')}
            </Typography>
          </Card>
          
          <Card className="text-center bg-blue-50 border-blue-200">
            <Typography variant="caption" color="muted" className="mb-2">
              Dernière mise à jour
            </Typography>
            <Typography variant="body" className="text-blue-600 font-medium">
              {formatDate(currentRate.updatedAt)}
            </Typography>
          </Card>
        </div>
      )} */}

      {savings && savings.length > 0 ? (
        <div>
          <Typography variant="h4" className="mb-4">
            {t('mySavingsAccounts')} ({savings.length})
          </Typography>
          <div className="grid gap-4 md:grid-cols-2">
            {savings.map((saving: SavingDTO) => (
              <Link 
                key={saving.id} 
                href={`/${locale}/dashboard/savings/${saving.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl"></span>
                      <div>
                        <Typography variant="body" className="font-medium">
                          {saving.savingProduct?.label ?? t('savingsAccount')}
                        </Typography>
                        <Typography variant="caption" color="muted">
                          {t('rateLabel')}: {(saving.savingProduct?.rate || 0).toFixed(2)}%
                        </Typography>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {t('active')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Typography variant="caption" color="muted">
                        {t('balance')}
                      </Typography>
                      <Typography variant="h4" className="text-green-600">
                        {formatCurrency(saving.balance)}
                      </Typography>
                    </div>
                    <Typography variant="caption" color="muted">
                      {t('openedOn')} {formatDate(saving.createdAt)}
                    </Typography>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <Typography variant="h4" className="mb-2">
            {t('noSavingsAccount')}
          </Typography>
          <Typography color="muted" className="mb-6">
            {t('noSavingsDescription')}
          </Typography>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            {t('openAccount')}
          </Button>
        </Card>
      )}

      {/* {currentRate && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl"></span>
            <div>
              <Typography variant="body" className="font-medium text-blue-900 mb-2">
                {t('importantInfo')}
              </Typography>
              <Typography variant="caption" className="text-blue-800">
                • Taux actuel: {currentRate.rate}% par an<br/>
                • Dernière mise à jour: {formatDate(currentRate.updatedAt)}<br/>
                • Calcul des intérêts journalier<br/>
                • Capital garanti
              </Typography>
            </div>
          </div>
        </Card>
      )} */}

      <CreateSavingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetchSavings}
        existingSavings={savings || []}
      />
    </div>
  );
};

export default SavingsOverview;