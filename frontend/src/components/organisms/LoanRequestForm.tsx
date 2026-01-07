'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useRequestLoan } from '@/features/loans/useRequestLoan';
import { useTranslations } from 'next-intl';

export const LoanRequestForm: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const t = useTranslations('Loans.request.form');
  
  const { requestLoan, loading, error, success } = useRequestLoan();
  
  const [amount, setAmount] = useState<string>('');
  const [durationInMonth, setDurationInMonth] = useState<string>('');
  const [annualInterestRate] = useState<number>(350); // 3.5% (fixé par la banque)
  const [annualInsuranceRate] = useState<number>(50); // 0.5% (fixé par la banque)
  const [purpose, setPurpose] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await requestLoan({
      amount: Number(amount) * 100, // Convertir en centimes
      durationInMonth: Number(durationInMonth),
      annualInterestRate,
      annualInsuranceRate,
    });

    if (result) {
      // Rediriger vers la liste des prêts après 2 secondes
      setTimeout(() => {
        router.push(`/${locale}/client/dashboard/loans`);
      }, 2000);
    }
  };

  if (success) {
    return (
      <Card className="text-center py-12 bg-green-50 border-green-200">
        <Typography variant="h3" className="mb-4 text-green-700">
          {t('successTitle')}
        </Typography>
        <Typography variant="body" color="muted" className="mb-6">
          {t('successBody')}
        </Typography>
        <Typography variant="caption" className="text-green-600">
          {t('redirecting')}
        </Typography>
      </Card>
    );
  }

  return (
    <Card>
      <Typography variant="h3" className="mb-6">{t('title')}</Typography>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Montant */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">{t('amountLabel')}</label>
          <input
            id="amount"
            type="number"
            min="1000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder={t('amountPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Typography variant="caption" color="muted" className="mt-1">{t('amountHint')}</Typography>
        </div>

        {/* Durée */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">{t('durationLabel')}</label>
          <input
            id="duration"
            type="number"
            min="6"
            max="600"
            step="6"
            value={durationInMonth}
            onChange={(e) => setDurationInMonth(e.target.value)}
            required
            placeholder={t('durationPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Typography variant="caption" color="muted" className="mt-1">{t('durationHint')}</Typography>
        </div>

        {/* Objet du prêt */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">{t('purposeLabel')}</label>
          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t('purposeSelect')}</option>
            <option value="AUTO">{t('purpose.AUTO')}</option>
            <option value="IMMOBILIER">{t('purpose.IMMOBILIER')}</option>
            <option value="TRAVAUX">{t('purpose.TRAVAUX')}</option>
            <option value="CONSOMMATION">{t('purpose.CONSOMMATION')}</option>
            <option value="AUTRE">{t('purpose.AUTRE')}</option>
          </select>
        </div>

        {/* Conditions */}
        <Card className="bg-blue-50 border-blue-200">
          <Typography variant="h4" className="mb-3 text-blue-900">{t('conditionsTitle')}</Typography>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography variant="caption" color="muted">{t('interestRate')}</Typography>
              <Typography variant="caption" className="font-semibold">
                {(annualInterestRate / 100).toFixed(2)}%
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="caption" color="muted">{t('insuranceRate')}</Typography>
              <Typography variant="caption" className="font-semibold">
                {(annualInsuranceRate / 100).toFixed(2)}%
              </Typography>
            </div>
          </div>
          <Typography variant="caption" className="text-blue-700 mt-4 block">{t('conditionsNote')}</Typography>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <Typography variant="caption" className="text-red-700">
              ❌ {error}
            </Typography>
          </div>
        )}

        <div className="flex space-x-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => router.back()}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button 
            type="submit"
            variant="primary" 
            disabled={loading}
            className="flex-1"
          >
            {loading ? t('submitting') : t('submit')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LoanRequestForm;
