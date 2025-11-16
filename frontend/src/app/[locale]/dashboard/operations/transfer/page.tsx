'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { useAuth } from '../../../../../contexts/AuthProvider';
import { useToast } from '../../../../../contexts/ToastProvider';
import { useGetAccounts } from '../../../../../features/account/useGetAccounts';
import { useTransfer } from '../../../../../features/operations/useTransfer';
import { formatCurrency, maskIBAN } from '../../../../../lib/formatters';

export default function TransferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { accounts, loading: accountsLoading } = useGetAccounts();
  const { transfer, loading: transferLoading, error: transferError, success } = useTransfer();
  const toast = useToast();
  
  const [locale] = useState('fr');
  const [formData, setFormData] = useState({
    fromAccountId: fromParam || '',
    toAccountId: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  useEffect(() => {
    if (success) {
      toast.success('Virement effectué avec succès ✅');
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
      newErrors.fromAccountId = 'Compte source requis';
    }

    if (!formData.toAccountId) {
      newErrors.toAccountId = 'Compte destinataire requis';
    }

    if (formData.fromAccountId && formData.toAccountId && formData.fromAccountId === formData.toAccountId) {
      newErrors.toAccountId = 'Les comptes source et destination doivent être différents';
    }

    const amount = Number.parseFloat(formData.amount);
    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Le montant doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await transfer({
      fromAccountId: formData.fromAccountId,
      toAccountId: formData.toAccountId,
      amount: Number.parseFloat(formData.amount),
      description: formData.description || undefined,
    });
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  const fromAccount = accounts?.find((acc) => acc.id === formData.fromAccountId);
  const toAccount = accounts?.find((acc) => acc.id === formData.toAccountId);
  const amount = Number.parseFloat(formData.amount) || 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Typography variant="h2" className="mb-2">
            Effectuer un virement
          </Typography>
          <Typography color="muted">
            Transférer des fonds entre vos comptes
          </Typography>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fromAccountId" className="block text-sm font-medium text-gray-700 mb-2">
                Compte source *
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
                <option value="">Sélectionner un compte</option>
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
              <label htmlFor="toAccountId" className="block text-sm font-medium text-gray-700 mb-2">
                Compte destinataire *
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
                <option value="">Sélectionner un compte</option>
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

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Montant *
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
                Description (optionnel)
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

            {fromAccount && toAccount && amount > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <Typography variant="h4" className="mb-4 text-blue-900">
                  Récapitulatif
                </Typography>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">De:</span>
                    <span className="font-medium text-gray-900">{fromAccount.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Vers:</span>
                    <span className="font-medium text-gray-900">{toAccount.label}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-300">
                    <span className="text-gray-700 font-medium">Montant:</span>
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
                {transferLoading ? 'Virement en cours...' : 'Confirmer le virement'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={transferLoading}
              >
                Annuler
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
