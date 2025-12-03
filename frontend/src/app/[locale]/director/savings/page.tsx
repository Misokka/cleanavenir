'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { getCurrentSavingsRate, getSavingsRateHistory, updateSavingsRate, SavingsRate } from '@/lib/api/director/savings';
import { useToast } from '@/contexts/ToastProvider';

export default function DirectorSavingsPage() {
  const t = useTranslations('Director.savings');
  const { success, error: showError } = useToast();
  const [currentRate, setCurrentRate] = useState<SavingsRate | null>(null);
  const [history, setHistory] = useState<SavingsRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newRate, setNewRate] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [rate, hist] = await Promise.all([
      getCurrentSavingsRate(),
      getSavingsRateHistory(),
    ]);
    setCurrentRate(rate);
    setHistory(hist);
    setLoading(false);
  };

  const handleUpdate = async () => {
    const rateValue = Number.parseFloat(newRate);
    
    if (Number.isNaN(rateValue) || rateValue < 0 || rateValue > 100) {
      showError(t('toasts.invalidRate'));
      return;
    }

    setUpdating(true);
    try {
      await updateSavingsRate({
        newRate: rateValue,
        effectiveDate: effectiveDate || undefined,
        reason: reason || undefined,
      });
      success(t('toasts.updateSuccess'));
      setShowUpdateForm(false);
      setNewRate('');
      setEffectiveDate('');
      setReason('');
      await loadData();
    } catch (err) {
      console.error('Error updating savings rate:', err);
      showError(t('toasts.updateError'));
    } finally {
      setUpdating(false);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </Card>
            <Card className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h2">{t('title')}</Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Typography variant="h3" className="mb-4">
              {t('currentRate.title')}
            </Typography>
            <div className="text-center py-8">
              <Typography variant="h1" color="primary" className="mb-2">
                {currentRate?.rate || 0}%
              </Typography>
              {currentRate && (
                <>
                  <Typography variant="caption" color="muted">
                    {t('currentRate.effectiveDate', { date: formatDate(currentRate.effectiveDate) })}
                  </Typography>
                  <Typography variant="caption" color="muted" className="block mt-2">
                    {t('currentRate.lastModified', { date: formatDate(currentRate.createdAt) })}
                  </Typography>
                </>
              )}
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="w-full mt-4"
            >
              {showUpdateForm ? t('updateForm.cancel') : t('updateForm.title')}
            </Button>
          </Card>

          {showUpdateForm && (
            <Card>
              <Typography variant="h3" className="mb-4">
                {t('updateForm.title')}
              </Typography>
              <div className="space-y-4">
                <div>
                  <Typography variant="caption" className="mb-2">
                    {t('updateForm.newRate')}
                  </Typography>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    fullWidth
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <Typography variant="caption" className="mb-2">
                    {t('updateForm.effectiveDate')}
                  </Typography>
                  <Input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <Typography variant="caption" className="mb-2">
                    {t('updateForm.reason')}
                  </Typography>
                  <Input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    placeholder="Ajustement selon inflation..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setShowUpdateForm(false)}
                    className="flex-1"
                  >
                    {t('updateForm.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleUpdate}
                    disabled={updating || !newRate}
                    className="flex-1"
                  >
                    {t('updateForm.submit')}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card>
          <Typography variant="h3" className="mb-4">
            {t('history.title')}
          </Typography>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('history.rate')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('history.effectiveDate')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {t('history.modifiedBy')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">
                      {t('history.noHistory')}
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-clean-dark">{item.rate}%</td>
                      <td className="py-3 px-4">{formatDate(item.effectiveDate)}</td>
                      <td className="py-3 px-4">{item.createdBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
