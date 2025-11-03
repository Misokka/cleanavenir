'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { 
  DashboardAccount, 
  SavingsRate, 
  formatCurrency,
  formatDate,
  getSavingsAccounts,
  getTotalBalance
} from '../../features/dashboard/mocks';

interface SavingsOverviewProps {
  accounts: DashboardAccount[];
  savingsRate: SavingsRate;
}

export const SavingsOverview: React.FC<SavingsOverviewProps> = ({ 
  accounts,
  savingsRate
}) => {
  const t = useTranslations('Dashboard');
  const locale = useLocale();

  const savingsAccounts = getSavingsAccounts(accounts);
  const totalSavings = getTotalBalance(savingsAccounts);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h3" color="primary">
          {t('savings.title')}
        </Typography>
        <Button variant="primary" size="sm">
          {t('savings.openAccount')}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center bg-green-50 border-green-200">
          <Typography variant="caption" color="muted" className="mb-2">
            {t('savings.currentRate')}
          </Typography>
          <Typography variant="h2" className="text-green-600 font-bold">
            {savingsRate.baseRate}%
          </Typography>
        </Card>
        
        <Card className="text-center bg-blue-50 border-blue-200">
          <Typography variant="caption" color="muted" className="mb-2">
            {t('savings.premiumRate')}
          </Typography>
          <Typography variant="h2" className="text-blue-600 font-bold">
            {savingsRate.premiumRate}%
          </Typography>
        </Card>
        
        <Card className="text-center bg-gray-50 border-gray-200">
          <Typography variant="caption" color="muted" className="mb-2">
            {t('savings.minimumAmount')}
          </Typography>
          <Typography variant="h2" className="text-gray-600 font-bold">
            {formatCurrency(savingsRate.minimumAmount)}
          </Typography>
        </Card>
      </div>

      {totalSavings > 0 && (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="text-center">
            <Typography variant="caption" className="text-white opacity-90 mb-2">
              {t('savings.totalSavings')}
            </Typography>
            <Typography variant="h2" className="text-white font-bold">
              {formatCurrency(totalSavings)}
            </Typography>
            <Typography variant="caption" className="text-white opacity-75 mt-2">
              {t('savings.distributedOn')} {savingsAccounts.length} {savingsAccounts.length > 1 ? t('savings.accounts') : t('savings.account')}
            </Typography>
          </div>
        </Card>
      )}

      {savingsAccounts.length > 0 ? (
        <div>
          <Typography variant="h4" className="mb-4">
            {t('savings.mySavingsAccounts')}
          </Typography>
          <div className="grid gap-4 md:grid-cols-2">
            {savingsAccounts.map((account) => (
              <Link 
                key={account.id} 
                href={`/${locale}/dashboard/accounts/${account.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl"></span>
                      <div>
                        <Typography variant="body" className="font-medium">
                          {t('savings.savingsAccount')}
                        </Typography>
                        <Typography variant="caption" color="muted">
                          ••••{account.accountNumber.slice(-4)}
                        </Typography>
                      </div>
                    </div>
                    <div className="text-right">
                      <Typography variant="h4" className="text-green-600 font-bold">
                        {formatCurrency(account.balance)}
                      </Typography>
                      {account.interestRate && (
                        <Typography variant="caption" color="muted">
                          {account.interestRate}% {t('savings.perYear')}
                        </Typography>
                      )}
                    </div>
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
            Aucun compte d'épargne
          </Typography>
          <Typography color="muted" className="mb-6">
            Ouvrez votre premier compte d'épargne et commencez à faire fructifier votre argent
          </Typography>
          <Button variant="primary">
            {t('savings.openAccount')}
          </Button>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <span className="text-2xl"></span>
          <div>
            <Typography variant="body" className="font-medium text-blue-900 mb-2">
              {t('savings.importantInfo')}
            </Typography>
            <Typography variant="caption" className="text-blue-800">
              • {t('savings.rateInfo.baseRate', { rate: savingsRate.baseRate })}<br/>
              • {t('savings.rateInfo.premiumRate', { rate: savingsRate.premiumRate })}<br/>
              • {t('savings.rateInfo.minimumAmount', { amount: formatCurrency(savingsRate.minimumAmount) })}<br/>
              • {t('savings.rateInfo.lastUpdate', { date: formatDate(savingsRate.lastUpdated) })}
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SavingsOverview;