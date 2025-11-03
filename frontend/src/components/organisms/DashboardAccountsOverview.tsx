'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { DashboardAccount, formatCurrency, getTotalBalance } from '../../features/dashboard/mocks';

interface DashboardAccountsOverviewProps {
  accounts: DashboardAccount[];
  showTotal?: boolean;
  showViewAll?: boolean;
}

export const DashboardAccountsOverview: React.FC<DashboardAccountsOverviewProps> = ({ 
  accounts, 
  showTotal = true,
  showViewAll = true
}) => {
  const t = useTranslations('Dashboard');
  const accountsT = useTranslations('Accounts');
  const locale = useLocale();

  const getAccountTypeIcon = (type: DashboardAccount['type']): string => {
    switch (type) {
      case 'checking': return '';
      case 'savings': return '';
      case 'investment': return '';
      default: return '';
    }
  };

  const getAccountTypeName = (type: DashboardAccount['type']): string => {
    return accountsT(`types.${type}`);
  };

  const getBalanceColor = (balance: number): string => {
    return balance >= 0 ? 'text-green-600' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h3" color="primary">
          {t('overview.accountsSummary')}
        </Typography>
        {showViewAll && (
          <Link href={`/${locale}/dashboard/accounts`}>
            <Button variant="outline" size="sm">
              {t('overview.viewAll')}
            </Button>
          </Link>
        )}
      </div>

      {showTotal && (
        <Card className="bg-gradient-to-r from-clean-dark to-clean-secondary text-white">
          <div className="text-center">
            <Typography variant="caption" className="text-white opacity-90 mb-2">
              {t('overview.totalBalance')}
            </Typography>
            <Typography variant="h2" className="text-white font-bold">
              {formatCurrency(getTotalBalance(accounts))}
            </Typography>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Link 
            key={account.id} 
            href={`/${locale}/dashboard/accounts/${account.id}`}
            className="block"
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getAccountTypeIcon(account.type)}</span>
                  <div>
                    <Typography variant="h4" className="mb-1">
                      {getAccountTypeName(account.type)}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      ••••{account.accountNumber.slice(-4)}
                    </Typography>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  account.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {account.isActive ? accountsT('status.active') : accountsT('status.inactive')}
                </div>
              </div>
              
              <div className="text-right">
                <Typography 
                  variant="h3" 
                  className={`font-bold ${getBalanceColor(account.balance)}`}
                >
                  {formatCurrency(account.balance)}
                </Typography>
                
                {account.interestRate && (
                  <Typography variant="caption" color="muted" className="mt-1">
                    {account.interestRate}% {t('accounts.interestRate')}
                  </Typography>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🏦</div>
          <Typography variant="h4" className="mb-2">
            {t('overview.noAccountsAvailable')}
          </Typography>
          <Typography color="muted">
            {t('overview.accountsWillAppear')}
          </Typography>
        </Card>
      )}
    </div>
  );
};

export default DashboardAccountsOverview;