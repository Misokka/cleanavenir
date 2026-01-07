'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { loanService, type LoanDTO } from '@/infrastructure/web/services/loanService';
import { useLocale, useTranslations } from 'next-intl';

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = params.id as string;
  const localeFromParams = params.locale as string;
  const localeHook = useLocale();
  const locale = localeFromParams || localeHook;
  const t = useTranslations('Loans.detail');

  const [loan, setLoan] = useState<LoanDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoading(true);
        const data = await loanService.getLoanById(loanId);
        setLoan(data);
      } catch (_err: unknown) {
        void _err;
        setError(t('errorTitle'));
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchLoan();
    }
  }, [loanId, t]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'PAID_OFF':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'REJECTED':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  //

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !loan) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">⚠️</div>
          <Typography variant="h4" className="mb-2 text-red-700">
            {t('errorTitle')}
          </Typography>
          <Typography color="muted" className="mb-4">
            {error || t('notFound')}
          </Typography>
          <Button variant="primary" onClick={() => router.back()}>
            {t('back')}
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const paidAmount = loan.loanAmount - loan.remainingAmountToPay;
  const progress = (paidAmount / loan.loanAmount) * 100;
  //

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              ← {t('back')}
            </Button>
            <Typography variant="h1" className="mt-4">
              {t('title')}
            </Typography>
            <Typography variant="body" color="muted" className="mt-1">
              {t('requestedOn', { date: formatDate(loan.createdAt) })}
            </Typography>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(loan.status)}`}>
            {t(`status.${loan.status}`)}
          </span>
        </div>

        {/* Informations principales */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <Typography variant="caption" color="muted" className="mb-2">
              {t('borrowed')}
            </Typography>
            <Typography variant="h2" className="text-blue-700 font-bold">
              {formatCurrency(loan.loanAmount)}
            </Typography>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <Typography variant="caption" color="muted" className="mb-2">
              {t('remaining')}
            </Typography>
            <Typography variant="h2" className="text-orange-700 font-bold">
              {formatCurrency(loan.remainingAmountToPay)}
            </Typography>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <Typography variant="caption" color="muted" className="mb-2">
              {t('repaid')}
            </Typography>
            <Typography variant="h2" className="text-green-700 font-bold">
              {formatCurrency(paidAmount)}
            </Typography>
          </Card>
        </div>

        {/* Progression du remboursement */}
        {loan.status === 'ACTIVE' && (
          <Card>
            <Typography variant="h3" className="mb-4">
              {t('repaymentProgress')}
            </Typography>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Typography variant="body" color="muted">
                  {t('repaidPercent', { percent: Number(progress.toFixed(1)) })}
                </Typography>
                <Typography variant="body" className="font-semibold">
                  {formatCurrency(paidAmount)} / {formatCurrency(loan.loanAmount)}
                </Typography>
              </div>
              <div className="w-full">
                <progress
                  aria-label={t('repaymentProgress')}
                  className="w-full h-4 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-blue-600 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-blue-600"
                  max={100}
                  value={Math.max(0, Math.min(100, Math.round(progress)))}
                />
                {progress > 10 && (
                  <div className="flex justify-end pr-1">
                    <span className="text-xs font-semibold text-gray-600">{Math.round(progress)}%</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Détails du prêt */}
        <Card>
          <Typography variant="h3" className="mb-6">
            {t('title')}
          </Typography>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  {t('details.monthlyPayment')}
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {formatCurrency(loan.mensualities || loan.monthlyPayment || 0)}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  {t('details.totalDuration')}
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {loan.durationInMonth} {t('details.months')}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  {t('details.annualInterest')}
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {(loan.annualInterestRate / 100).toFixed(2)}%
                </Typography>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  {t('details.monthlyInsurance')}
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {formatCurrency(loan.insuranceMensualities || loan.monthlyInsurance || 0)}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" color="muted" className="block mb-1">
                  {t('details.annualInsurance')}
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {(loan.annualInsuranceRate / 100).toFixed(2)}%
                </Typography>
              </div>

              {loan.status === 'ACTIVE' && loan.nextToPayAt && (
                <div>
                  <Typography variant="caption" color="muted" className="block mb-1">
                    {t('details.nextPayment')}
                  </Typography>
                  <Typography variant="h4" className="font-semibold">
                    {formatDate(loan.nextToPayAt)}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Coût total */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="caption" color="muted" className="block mb-1">
                {t('totalCost.title')}
              </Typography>
              <Typography variant="h3" className="font-bold text-slate-800">
                {formatCurrency((loan.mensualities || 0) * loan.durationInMonth)}
              </Typography>
              <Typography variant="caption" color="muted" className="mt-1">
                {t('totalCost.breakdown', { amount: formatCurrency(((loan.mensualities || 0) * loan.durationInMonth) - loan.loanAmount) })}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Messages selon le statut */}
        {loan.status === 'PENDING' && (
          <Card className="bg-amber-50 border-amber-200">
            <div className="flex items-start space-x-3">
              <div>
                <Typography variant="h4" className="text-amber-800 mb-2">
                  {t('messages.pendingTitle')}
                </Typography>
                <Typography variant="body" color="muted">
                  {t('messages.pendingBody')}
                </Typography>
              </div>
            </div>
          </Card>
        )}

        {loan.status === 'REJECTED' && (
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✕</div>
              <div>
                <Typography variant="h4" className="text-red-800 mb-2">
                  {t('messages.rejectedTitle')}
                </Typography>
                <Typography variant="body" color="muted">
                  {t('messages.rejectedBody')}
                </Typography>
              </div>
            </div>
          </Card>
        )}

        {loan.status === 'PAID_OFF' && (
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✓</div>
              <div>
                <Typography variant="h4" className="text-green-800 mb-2">
                  {t('messages.paidOffTitle')}
                </Typography>
                <Typography variant="body" color="muted">
                  {t('messages.paidOffBody')}
                </Typography>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
