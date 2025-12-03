'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { getAllStocks, deleteStock, toggleStockAvailability, Stock } from '@/lib/api/director/stocks';
import { useToast } from '@/contexts/ToastProvider';
import Link from 'next/link';

export default function DirectorStocksPage() {
  const t = useTranslations('Director.stocks');
  const locale = useLocale();
  const { success, error: showError } = useToast();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadStocks();
  }, []);

  useEffect(() => {
    filterStocks();
  }, [stocks, searchQuery]);

  const loadStocks = async () => {
    setLoading(true);
    const data = await getAllStocks();
    setStocks(data);
    setLoading(false);
  };

  const filterStocks = () => {
    let filtered = stocks;

    if (searchQuery) {
      filtered = filtered.filter(
        (stock) =>
          stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStocks(filtered);
  };

  const handleToggleAvailability = async (stock: Stock) => {
    try {
      await toggleStockAvailability(stock.id, !stock.isAvailable);
      success(t('toasts.toggleSuccess'));
      await loadStocks();
    } catch (err) {
      console.error('Error toggling stock availability:', err);
      showError(t('toasts.toggleError'));
    }
  };

  const handleDelete = async () => {
    if (!selectedStock) return;

    setDeleting(true);
    try {
      await deleteStock(selectedStock.id);
      success(t('toasts.deleteSuccess'));
      setShowDeleteModal(false);
      await loadStocks();
    } catch (err) {
      console.error('Error deleting stock:', err);
      showError(t('toasts.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Typography variant="h2">{t('title')}</Typography>
          <Card className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h2">{t('title')}</Typography>
          <Link href={`/${locale}/director/stocks/create`}>
            <Button variant="primary" size="md">
              {t('list.addNew')}
            </Button>
          </Link>
        </div>

        <Card>
          <div className="mb-6">
            <Input
              type="text"
              placeholder={t('list.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.ticker')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.company')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.available')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.createdAt')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('list.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      {t('list.noStocks')}
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock) => (
                    <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-bold text-clean-dark">{stock.ticker}</td>
                      <td className="py-3 px-4">{stock.companyName}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleAvailability(stock)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            stock.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {stock.isAvailable ? t('availability.yes') : t('availability.no')}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(stock.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/${locale}/director/stocks/${stock.id}/edit`}>
                            <Button variant="outline" size="sm">
                              {t('actions.edit')}
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedStock(stock);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            {t('actions.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showDeleteModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full m-4">
            <Typography variant="h3" className="mb-4 text-red-600">
              {t('modals.deleteTitle')}
            </Typography>
            <Typography variant="body" className="mb-4">
              {t('modals.deleteMessage')}
            </Typography>
            <Typography variant="caption" color="muted" className="mb-4">
              {selectedStock.ticker} - {selectedStock.companyName}
            </Typography>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
                {t('modals.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('modals.confirm')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
