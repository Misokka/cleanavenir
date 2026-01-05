'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { companiesService, Company } from '@/infrastructure/web/services/companiesService';
import { stocksService } from '@/infrastructure/web/services/stocksService';
import { useToast } from '@/contexts/ToastProvider';

export default function CreateStockPage() {
  const t = useTranslations('Director.stocks');
  const locale = useLocale();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');
  const [initialQuantity, setInitialQuantity] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    const data = await companiesService.listCompanies();
    setCompanies(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId || !ticker.trim() || !price || !initialQuantity) {
      showError('Tous les champs requis doivent être remplis');
      return;
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(initialQuantity);

    if (isNaN(priceNum) || priceNum <= 0) {
      showError('Le prix doit être un nombre positif');
      return;
    }

    if (isNaN(quantityNum) || quantityNum <= 0) {
      showError('La quantité doit être un nombre positif');
      return;
    }

    setSubmitting(true);
    try {
      await stocksService.createStock({
        companyId,
        ticker: ticker.trim().toUpperCase(),
        price: priceNum,
        initialQuantity: quantityNum,
        isAvailable,
      });
      success(t('toasts.createSuccess'));
      router.push(`/${locale}/director/stocks`);
    } catch (err: any) {
      console.error('Error creating stock:', err);
      // Gérer l'erreur de ticker existant
      if (err?.response?.data?.message?.includes('UNIQUE constraint failed') || 
          err?.response?.data?.message?.includes('ticker')) {
        showError(`Une action avec le ticker "${ticker.toUpperCase()}" existe déjà. Veuillez utiliser un ticker différent.`);
      } else {
        showError(t('toasts.createError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Typography variant="h2">{t('form.createTitle')}</Typography>
          <Card className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Typography variant="h2">{t('form.createTitle')}</Typography>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  {t('form.company')} *
                </Typography>
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-clean-dark focus:ring-clean-dark"
                required
              >
                <option value="">Sélectionner une entreprise</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  {t('form.ticker')} *
                </Typography>
              </label>
              <Input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                fullWidth
                placeholder="AAPL"
                required
                maxLength={10}
              />
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  Prix initial (€) *
                </Typography>
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                placeholder="100.00"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  Quantité initiale *
                </Typography>
              </label>
              <Input
                type="number"
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(e.target.value)}
                fullWidth
                placeholder="1000"
                required
                min="1"
                step="1"
              />
              <Typography variant="caption" className="text-gray-500 mt-1">
                Nombre d'actions à mettre en circulation dans le portfolio système
              </Typography>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-5 h-5 text-clean-dark border-gray-300 rounded focus:ring-clean-dark"
                />
                <Typography variant="caption" className="font-medium">
                  {t('form.isAvailable')}
                </Typography>
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => router.push(`/${locale}/director/stocks`)}
                className="flex-1"
              >
                {t('form.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting || !companyId || !ticker.trim() || !price || !initialQuantity}
                className="flex-1"
              >
                {t('form.submit')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
