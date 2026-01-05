'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useGetAccounts } from '../../features/account/useGetAccounts';
import { AccountDTO } from '../../infrastructure/web/types';
import { CreateAccountModal } from '../molecules/CreateAccountModal';
import { formatIban } from '../../utils/formatIban';

interface DashboardAccountsOverviewProps {
  showTotal?: boolean;
  showViewAll?: boolean;
}

export const DashboardAccountsOverview: React.FC<DashboardAccountsOverviewProps> = ({ 
  showTotal = true,
  showViewAll = true
}) => {
  const t = useTranslations('Dashboard.overview');
  const tAccounts = useTranslations('Accounts');
  const locale = useLocale();
  const { accounts, loading, error, refetch } = useGetAccounts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Traduire le label du compte basé sur des patterns connus
  const translateAccountLabel = (label: string): string => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('checking') || labelLower.includes('courant')) {
      return tAccounts('types.checking');
    }
    if (labelLower.includes('savings') || labelLower.includes('épargne') || labelLower.includes('livret')) {
      return tAccounts('types.savings');
    }
    if (labelLower.includes('investment') || labelLower.includes('investissement')) {
      return tAccounts('types.investment');
    }
    return label; // Retourner le label original si non reconnu
  };

  const getTotalBalance = () => {
    if (!accounts) return 0;
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const getBalanceColor = (balance: number): string => {
    return balance >= 0 ? 'text-green-600' : 'text-red-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          {showViewAll && (
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          )}
        </div>
        
        {showTotal && (
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Typography variant="h3" color="primary">
          {t('accountsSummary')}
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

  if (!accounts || accounts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Typography variant="h3" color="primary">
            {t('accountsSummary')}
          </Typography>
        </div>
        
        <Card className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <Typography variant="h4" className="mb-2">
            {t('noAccountsAvailable')}
          </Typography>
          <Typography color="muted" className="mb-6">
            {t('accountsWillAppear')}
          </Typography>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            {t('openAccount')}
          </Button>
        </Card>

        <CreateAccountModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + {t('createAccount')}
          </Button>
          {showViewAll && (
            <Link href={`/${locale}/dashboard/accounts`}>
              <Button variant="outline" size="sm">
                {t('viewAll')}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {showTotal && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="text-center">
            <Typography variant="caption" className="text-white opacity-90 mb-2">
              {t('totalBalance')}
            </Typography>
            <Typography variant="h2" className="text-white font-bold">
              {formatCurrency(getTotalBalance())}
            </Typography>
            <Typography variant="caption" className="text-white opacity-75 mt-2">
              {t('distributedOn')} {accounts.length} {accounts.length > 1 ? t('accounts') : t('account')}
            </Typography>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account: AccountDTO) => (
          <Link 
            key={account.id} 
            href={`/${locale}/dashboard/accounts/${account.id}`}
            className="block"
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl"></span>
                  <div>
                    <Typography variant="h4" className="mb-1">
                      {translateAccountLabel(account.label)}
                    </Typography>
                    <Typography variant="caption" color="muted" className="font-mono text-xs">
                      {formatIban(account.iban)}
                    </Typography>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Typography 
                  variant="h3" 
                  className={`font-bold ${getBalanceColor(account.balance)}`}
                >
                  {formatCurrency(account.balance, account.currency)}
                </Typography>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default DashboardAccountsOverview;