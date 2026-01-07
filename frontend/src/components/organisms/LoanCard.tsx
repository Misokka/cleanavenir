'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import type { LoanDTO } from '@/infrastructure/web/services/loanService';

interface LoanCardProps {
  loan: LoanDTO;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
  const locale = useLocale();
  const tLoans = useTranslations('Loans');
  const tDetail = useTranslations('Loans.detail');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID_OFF':
        return 'bg-gray-100 text-gray-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => tDetail(`status.${status}` as const);

  const progress = loan.status === 'ACTIVE' 
    ? ((loan.loanAmount - loan.remainingAmountToPay) / loan.loanAmount) * 100
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Typography variant="body" className="font-semibold text-gray-900 mb-1">
            {tLoans('card.personalLoan')}
          </Typography>
          <Typography variant="caption" color="muted">
            {tDetail('requestedOn', { date: formatDate(loan.createdAt) })}
          </Typography>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
          {getStatusLabel(loan.status)}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <Typography variant="caption" color="muted" className="block mb-1">
            {tLoans('card.loanAmount')}
          </Typography>
          <Typography variant="h3" className="font-bold text-gray-900">
            {formatCurrency(loan.loanAmount)}
          </Typography>
        </div>

        {loan.status === 'ACTIVE' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{tDetail('repaid')}</span>
                <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
              </div>
              <progress
                aria-label={tDetail('repaymentProgress')}
                className="w-full h-2 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-blue-600 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-blue-600"
                max={100}
                value={Math.max(0, Math.min(100, Math.round(progress)))}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatCurrency(loan.loanAmount - loan.remainingAmountToPay)}</span>
                <span>{formatCurrency(loan.remainingAmountToPay)} {tDetail('remaining')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <Typography variant="caption" color="muted">{tDetail('details.monthlyPayment')}</Typography>
              <Typography variant="body" className="font-semibold text-gray-900">
                {formatCurrency(loan.mensualities || loan.monthlyPayment || 0)}
              </Typography>
            </div>

            {loan.nextToPayAt && (
              <div className="text-sm text-gray-600">
                {tDetail('details.nextPayment')} <span className="font-medium">{formatDate(loan.nextToPayAt)}</span>
              </div>
            )}
          </>
        )}

        {loan.status === 'PAID_OFF' && (
          <div className="py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
            <Typography variant="caption" className="text-green-800">{tDetail('messages.paidOffTitle')}</Typography>
          </div>
        )}

        <div className="pt-4 border-t">
          <Link href={`/${locale}/client/dashboard/loans/${loan.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              {tLoans('viewDetails')}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default LoanCard;
