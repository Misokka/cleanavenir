'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { TransferPageSkeleton } from '../../../../../components/molecules/OperationSkeleton';
import { useAuth } from '../../../../../contexts/AuthProvider';
import { useToast } from '../../../../../contexts/ToastProvider';
import { useGetAccounts } from '../../../../../features/account/useGetAccounts';
import { useTransfer } from '../../../../../features/operations/useTransfer';
import { useGetBeneficiaries } from '../../../../../features/beneficiaries/useGetBeneficiaries';
import { formatCurrency, maskIBAN } from '../../../../../lib/formatters';

export default function TransferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  const beneficiaryIdParam = searchParams.get('beneficiaryId');
  const ibanParam = searchParams.get('iban');
  const t = useTranslations('Transfer');
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { accounts, loading: accountsLoading } = useGetAccounts();
  const { beneficiaries, loading: beneficiariesLoading } = useGetBeneficiaries();
  const { transfer, loading: transferLoading, error: transferError, success } = useTransfer();
  const toast = useToast();
  
  const [locale] = useState('fr');
  const [destinationType, setDestinationType] = useState<'my-account' | 'beneficiary' | 'new-iban'>('my-account');
  const [formData, setFormData] = useState({
    fromAccountId: fromParam || '',
    toAccountId: '',
    beneficiaryId: beneficiaryIdParam || '',
    iban: ibanParam || '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (beneficiaryIdParam && ibanParam) {
      setDestinationType('beneficiary');
      setFormData(prev => ({ 
        ...prev, 
        beneficiaryId: beneficiaryIdParam,
        iban: ibanParam 
      }));
    }
  }, [beneficiaryIdParam, ibanParam]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  useEffect(() => {
    if (success) {
      toast.success('Virement effectué avec succès');
      setTimeout(() => {
        router.push(`/${locale}/client/dashboard`);
      }, 1500);
    }
  }, [success, router, locale, toast]);

  useEffect(() => {
    if (transferError) {
      toast.error(transferError);
    }
  }, [transferError, toast]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = t('errors.fromAccountRequired');
    }

    if (destinationType === 'my-account') {
      if (!formData.toAccountId) {
        newErrors.toAccountId = t('errors.destinationRequired');
      }
      if (formData.fromAccountId && formData.toAccountId && formData.fromAccountId === formData.toAccountId) {
        newErrors.toAccountId = t('errors.sameAccount');
      }
    } else if (destinationType === 'beneficiary') {
      if (!formData.beneficiaryId) {
        newErrors.beneficiaryId = t('errors.destinationRequired');
      }
    } else if (destinationType === 'new-iban') {
      if (!formData.iban) {
        newErrors.iban = t('errors.destinationRequired');
      }
    }

    const amount = Number.parseFloat(formData.amount);
    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      newErrors.amount = t('errors.amountPositive');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: any = {
      fromAccountId: formData.fromAccountId,
      amount: Number.parseFloat(formData.amount),
      description: formData.description || undefined,
    };

    if (destinationType === 'my-account') {
      payload.toAccountId = formData.toAccountId;
    } else if (destinationType === 'beneficiary') {
      const beneficiary = beneficiaries?.find(b => b.id === formData.beneficiaryId);
      if (beneficiary) {
        payload.toIban = beneficiary.iban;
      }
    } else if (destinationType === 'new-iban') {
      payload.toIban = formData.iban;
    }

    await transfer(payload);
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <TransferPageSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (accountsLoading) {
    return (
      <DashboardLayout>
        <TransferPageSkeleton />
      </DashboardLayout>
    );
  }

  const fromAccount = accounts?.find((acc) => acc.id === formData.fromAccountId);
  const toAccount = accounts?.find((acc) => acc.id === formData.toAccountId);
  const selectedBeneficiary = beneficiaries?.find((b) => b.id === formData.beneficiaryId);
  const amount = Number.parseFloat(formData.amount) || 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Typography variant="h2" className="mb-2">
            {t('title')}
          </Typography>
          <Typography color="muted">
            {t('subtitle')}
          </Typography>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fromAccountId" className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.fromAccount')} *
              </label>
              <select
                id="fromAccountId"
                value={formData.fromAccountId}
                onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                disabled={accountsLoading || transferLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fromAccountId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('fields.selectAccount')}</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label} - {maskIBAN(account.iban)} - {formatCurrency(account.balance, 'fr-FR', account.currency)}
                  </option>
                ))}
              </select>
              {errors.fromAccountId && (
                <p className="mt-1 text-sm text-red-600">{errors.fromAccountId}</p>
              )}
              {fromAccount && (
                <p className="mt-2 text-sm text-gray-600">
                  Solde disponible: {formatCurrency(fromAccount.balance, 'fr-FR', fromAccount.currency)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('destinationType.label')} *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDestinationType('my-account')}
                  className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    destinationType === 'my-account'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {t('destinationType.myAccount')}
                </button>
                <button
                  type="button"
                  onClick={() => setDestinationType('beneficiary')}
                  className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    destinationType === 'beneficiary'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {t('destinationType.beneficiary')}
                </button>
                <button
                  type="button"
                  onClick={() => setDestinationType('new-iban')}
                  className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                    destinationType === 'new-iban'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {t('destinationType.newIban')}
                </button>
              </div>
            </div>

            {destinationType === 'my-account' && (
              <div>
                <label htmlFor="toAccountId" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.toAccount')} *
                </label>
                <select
                  id="toAccountId"
                  value={formData.toAccountId}
                  onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                  disabled={accountsLoading || transferLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.toAccountId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t('fields.selectAccount')}</option>
                  {accounts?.filter((acc) => acc.id !== formData.fromAccountId).map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.label} - {maskIBAN(account.iban)}
                    </option>
                  ))}
                </select>
                {errors.toAccountId && (
                  <p className="mt-1 text-sm text-red-600">{errors.toAccountId}</p>
                )}
              </div>
            )}

            {destinationType === 'beneficiary' && (
              <div>
                <label htmlFor="beneficiaryId" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.beneficiary')} *
                </label>
                <select
                  id="beneficiaryId"
                  value={formData.beneficiaryId}
                  onChange={(e) => setFormData({ ...formData, beneficiaryId: e.target.value })}
                  disabled={beneficiariesLoading || transferLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.beneficiaryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{t('fields.selectBeneficiary')}</option>
                  {beneficiaries?.map((beneficiary) => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.label} - {maskIBAN(beneficiary.iban)}
                    </option>
                  ))}
                </select>
                {errors.beneficiaryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.beneficiaryId}</p>
                )}
              </div>
            )}

            {destinationType === 'new-iban' && (
              <div>
                <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.iban')} *
                </label>
                <input
                  id="iban"
                  type="text"
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                  disabled={transferLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.iban ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.iban && (
                  <p className="mt-1 text-sm text-red-600">{errors.iban}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.amount')} *
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  disabled={transferLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.description')}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={transferLoading}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Remboursement, Épargne mensuelle..."
              />
            </div>

            {fromAccount && (destinationType === 'my-account' ? toAccount : (destinationType === 'beneficiary' ? selectedBeneficiary : formData.iban)) && amount > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <Typography variant="h4" className="mb-4 text-blue-900">
                  {t('summary.title')}
                </Typography>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{t('summary.from')}:</span>
                    <span className="font-medium text-gray-900">{fromAccount.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">{t('summary.to')}:</span>
                    <span className="font-medium text-gray-900">
                      {destinationType === 'my-account' && toAccount && toAccount.label}
                      {destinationType === 'beneficiary' && selectedBeneficiary && selectedBeneficiary.label}
                      {destinationType === 'new-iban' && maskIBAN(formData.iban)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-300">
                    <span className="text-gray-700 font-medium">{t('summary.amount')}:</span>
                    <span className="font-bold text-blue-900">
                      {formatCurrency(amount, 'fr-FR', 'EUR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Nouveau solde (compte source):</span>
                    <span className={`font-medium ${fromAccount.balance - amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(fromAccount.balance - amount, 'fr-FR', fromAccount.currency)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={transferLoading || accountsLoading}
                className="flex-1"
              >
                {transferLoading ? 'Virement en cours...' : t('actions.submit')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={transferLoading}
              >
                {t('actions.cancel')}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <div>
              <Typography variant="body" className="font-medium text-yellow-900 mb-2">
                Information importante
              </Typography>
              <Typography variant="caption" className="text-yellow-800">
                • Vérifiez attentivement les comptes et le montant avant de confirmer<br/>
                • Le virement est immédiat entre vos comptes<br/>
                • Vous recevrez une confirmation par email
              </Typography>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
