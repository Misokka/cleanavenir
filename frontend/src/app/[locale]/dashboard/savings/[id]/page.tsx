'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { SavingDetailSkeleton } from '../../../../../components/molecules/SavingSkeleton';
import { TransferFromSavingModal } from '../../../../../components/molecules/TransferFromSavingModal';
import { DepositToSavingModal } from '../../../../../components/molecules/DepositToSavingModal';
import { useAuth } from '../../../../../contexts/AuthProvider';
import { useToast } from '../../../../../contexts/ToastProvider';
import { useGetSavingDetails } from '../../../../../features/savings/useGetSavings';
import { useGetAccounts } from '../../../../../features/account/useGetAccounts';
import Link from 'next/link';

export default function SavingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const localeParam = params.locale as string;
  const locale = useLocale();
  const t = useTranslations('Savings.detail');
  const savingId = params.id as string;
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const { saving, loading, error, refetch } = useGetSavingDetails(savingId);
  const { accounts } = useGetAccounts();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleDepositSuccess = () => {
    refetch();
    addToast('success', t('toasts.depositSuccess'));
  };

  const handleTransferSuccess = () => {
    refetch();
    addToast('success', t('toasts.transferSuccess'));
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${localeParam}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, localeParam]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <SavingDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <SavingDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !saving) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <Typography variant="h4" className="mb-2 text-red-700">
            {t('errorTitle')}
          </Typography>
          <Typography color="muted" className="mb-4">
            {error || t('notFound')}
          </Typography>
          <Button variant="primary" onClick={() => router.push(`/${localeParam}/dashboard/savings`)}>
            {t('backToSavings')}
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const sourceAccount = accounts?.find(acc => acc.id === saving.accountId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateDailyInterest = () => {
    if(!saving.savingProduct) return 0;
    const ratePercent = saving.savingProduct.rate; // Déjà en pourcentage (10.75 pour 10.75%)
    return Math.ceil((saving.balance * (ratePercent / 100)) / 365 * 100) / 100;
  };

  const calculateMonthlyInterest = () => {
    if(!saving.savingProduct) return 0;
    const ratePercent = saving.savingProduct.rate;
    return Math.round((saving.balance * (ratePercent / 100)) / 12 * 100) / 100;
  };

  const calculateYearlyInterest = () => {
    if(!saving.savingProduct) return 0;
    const ratePercent = saving.savingProduct.rate;
    return Math.round(saving.balance * (ratePercent / 100) * 100) / 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-full">
                <span className="text-4xl"></span>
              </div>
              <div>
                <Typography variant="caption" className="text-green-100 mb-1">
                  {t('title')}
                </Typography>
                <Typography variant="h3" className="font-bold">
                  {formatCurrency(saving.balance)}
                </Typography>
              </div>
            </div>
            <Link href={`/${localeParam}/dashboard/savings`}>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                ← {t('back')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Typography variant="caption" className="text-green-100 mb-1">
                {saving.savingProduct?.label}
              </Typography>
              <Typography variant="body" className="font-semibold">
                {t('rate')}: {(saving.savingProduct?.rate || 0).toFixed(2)}%
              </Typography>
            </div>
            <div>
              <Typography variant="caption" className="text-green-100 mb-1">
                {t('openedOn')}
              </Typography>
              <Typography variant="body" className="font-semibold">
                {formatDate(saving.createdAt)}
              </Typography>
            </div>
            <div>
              {/* <Typography variant="caption" className="text-green-100 mb-1">
                {t('lastUpdate')}
              </Typography>
              <Typography variant="body" className="font-semibold">
                {formatDate(saving.updatedAt)}
              </Typography> */}
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <Typography variant="caption" color="muted" className="mb-2">
                {t('dailyInterests')}
              </Typography>
              <Typography variant="h3" className="text-green-600 font-bold mb-1">
                +{formatCurrency(calculateDailyInterest())}
              </Typography>
              <Typography variant="caption" color="muted">
                {t('perDay')}
              </Typography>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <Typography variant="caption" color="muted" className="mb-2">
                {t('monthlyInterests')}
              </Typography>
              <Typography variant="h3" className="text-green-600 font-bold mb-1">
                +{formatCurrency(calculateMonthlyInterest())}
              </Typography>
              <Typography variant="caption" color="muted">
                {t('perMonth')}
              </Typography>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <Typography variant="caption" color="muted" className="mb-2">
                {t('yearlyInterests')}
              </Typography>
              <Typography variant="h3" className="text-green-600 font-bold mb-1">
                +{formatCurrency(calculateYearlyInterest())}
              </Typography>
              <Typography variant="caption" color="muted">
                {t('perYear')}
              </Typography>
            </div>
          </Card>
        </div>

        {sourceAccount && (
          <Card>
            <Typography variant="h4" className="mb-4">
              {t('linkedBankAccount')}
            </Typography>
            <Link href={`/${localeParam}/dashboard/accounts/${sourceAccount.id}`}>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl"></span>
                  </div>
                  <div>
                    <Typography variant="body" className="font-medium">
                      {sourceAccount.label}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {sourceAccount.iban}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body" className="font-semibold">
                    {formatCurrency(sourceAccount.balance)}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    {t('availableBalance')}
                  </Typography>
                </div>
              </div>
            </Link>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl"></span>
              <div>
                <Typography variant="body" className="font-medium text-blue-900 mb-2">
                  {t('howItWorks.title')}
                </Typography>
                <Typography variant="caption" className="text-blue-800">
                  • {t('howItWorks.dailyCalc')}<br/>
                  • {t('howItWorks.formula')}<br/>
                  • {t('howItWorks.addedAt')}<br/>
                  • {t('howItWorks.compound')}
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl"></span>
              <div>
                <Typography variant="body" className="font-medium text-green-900 mb-2">
                  {t('projection.title')}
                </Typography>
                <Typography variant="caption" className="text-green-800">
                  • {t('projection.currentBalance')}: {formatCurrency(saving.balance)}<br/>
                  • {t('projection.estimatedInterests')}: {formatCurrency(calculateYearlyInterest())}<br/>
                  • {t('projection.finalBalance')}: {formatCurrency(saving.balance + calculateYearlyInterest())}<br/>
                  • {t('projection.appliedRate')}: {(saving.savingProduct?.rate || 0).toFixed(2)}% 
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <Typography variant="h4" className="mb-4">
            {t('actions.title')}
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              onClick={() => setIsDepositModalOpen(true)}
            >
              {t('actions.deposit')}
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsTransferModalOpen(true)}
              disabled={saving.balance === 0}
            >
              {t('actions.transfer')}
            </Button>
            <Button variant="outline" onClick={refetch}>
              {t('actions.refresh')}
            </Button>
            <Link href={`/${localeParam}/dashboard/savings`}>
              <Button variant="secondary">
                {t('actions.viewAllSavings')}
              </Button>
            </Link>
            {sourceAccount && (
              <Link href={`/${localeParam}/dashboard/accounts/${sourceAccount.id}`}>
                <Button variant="secondary">
                  {t('actions.viewSourceAccount')}
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {accounts && (
          <>
            <TransferFromSavingModal
              isOpen={isTransferModalOpen}
              onClose={() => setIsTransferModalOpen(false)}
              onSuccess={handleTransferSuccess}
              savingId={savingId}
              savingBalance={saving.balance}
              accounts={accounts}
            />
            <DepositToSavingModal
              isOpen={isDepositModalOpen}
              onClose={() => setIsDepositModalOpen(false)}
              onSuccess={handleDepositSuccess}
              savingId={savingId}
              accounts={accounts}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
