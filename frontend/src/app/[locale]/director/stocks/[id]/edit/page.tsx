'use client';

import React, { useEffect, useState, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { companiesService, Company } from '@/infrastructure/web/services/companiesService';
import { UpdateStockPayload } from '@/infrastructure/web/services/stocksService';
import { useToast } from '@/contexts/ToastProvider';
import { useGetStock } from '@/features/admin/useGetStock';
import { useEditStock } from '@/features/admin/useEditStock';

interface EditStockPageProps {
  readonly params: Promise<{ id: string }>;
}

export default function EditStockPage({ params }: EditStockPageProps) {
  const { id } = use(params);
  const t = useTranslations('Director.stocks');
  const locale = useLocale();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {getStock, stock, loading, error} = useGetStock();
  const {editStock, success: editSuccess, error: editError, loading: editLoading} = useEditStock();

  const [formData, setFormData] = useState<UpdateStockPayload>({
    isAvailable: stock?.isAvailable ?? true,
    ticker: stock?.ticker ?? "",
    price: stock?.price
  })

  useEffect(() => {
    getStock(id)
  }, [id]);

  useEffect(() => {
    if(stock){
      setFormData((prev) => ({
        ...prev,
        isAvailable: stock.isAvailable,
        ticker: stock.ticker,
        price: stock.price
      }))
    }
  }, [stock])

  // const loadData = async () => {
  //   setLoading(true);
  //   try {
  //     const [stockData, companiesData] = await Promise.all([
  //       getStockById(id),
  //       getAllCompanies(),
  //     ]);
      
  //     if (stockData) {
  //       setStock(stockData);
  //       setCompanyId(stockData.companyId);
  //       setTicker(stockData.ticker);
  //       setIsAvailable(stockData.isAvailable);
  //     }
  //     setCompanies(companiesData);
  //   } catch (err) {
  //     console.error('Error loading data:', err);
  //     showError(t('toasts.loadError'));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ticker?.trim()) {
      showError('Tous les champs requis doivent être remplis');
      return;
    }

    setSubmitting(true);
    try {
      const response = await editStock(id, formData);
      if(response && response.success){
        success(t('toasts.updateSuccess'));
        router.push(`/${locale}/director/stocks`);
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      showError(t('toasts.updateError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Typography variant="h2">{t('form.editTitle')}</Typography>
          <Card className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!stock) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Typography variant="h2">{t('form.editTitle')}</Typography>
          <Card>
            <Typography variant="body">Action introuvable</Typography>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Typography variant="h2">{t('form.editTitle')} {stock.ticker}</Typography>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              {/* <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  {t('form.company')} *
                </Typography>
              </label> */}
              {/* <select
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
              </select> */}
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  {t('form.ticker')} *
                </Typography>
              </label>
              <Input
                type="text"
                value={formData.ticker}
                onChange={(e) => setFormData({
                  ...formData,
                  ticker: e.target.value.toUpperCase()
                })}
                fullWidth
                placeholder="AAPL"
                required
                maxLength={10}
              />
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="caption" className="font-medium">
                  Prix (€) *
                </Typography>
              </label>
              <Input
                type="number"
                value={formData.price ?? ''}
                onChange={(e) => setFormData({
                  ...formData,
                  price: e.target.value ? Number(e.target.value) : undefined
                })}
                fullWidth
                placeholder="100.00"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({
                    ...formData,
                    isAvailable: e.target.checked
                  })}
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
                disabled={submitting || !formData.ticker || !formData.ticker.trim()}
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
