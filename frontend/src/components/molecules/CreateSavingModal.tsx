'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useCreateSavingNew } from '../../features/savings/useGetSavings';
import { useGetAccounts } from '../../features/account/useGetAccounts';
import { useToast } from '../../contexts/ToastProvider';
import { useGetSavingProducts } from '@/features/savings/useGetSavingProducts';
import { SavingDTO } from '@/infrastructure/web/services/savingService';

interface CreateSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingSavings?: SavingDTO[];
}

export const CreateSavingModal: React.FC<CreateSavingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingSavings = [],
}) => {
  const t = useTranslations('Dashboard.savings.createModal');
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [savingProductId, setSavingProductId] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [rate, setRate] = useState('2.5'); 

  const { accounts, loading: accountsLoading } = useGetAccounts();
  const { savingProducts, isLoading} = useGetSavingProducts();
  const { createSaving, loading, error, success, reset } = useCreateSavingNew();
  const { addToast } = useToast();

  const availableSavingProducts = useMemo(() => {
    if (!savingProducts) return [];
    const usedProductIds = existingSavings.map(s => s.savingProduct?.id).filter(Boolean) as string[];
    return savingProducts.filter(product => !usedProductIds.includes(product.id));
  }, [savingProducts, existingSavings]);

  useEffect(() => {
    if (isOpen) {
      setSourceAccountId('');
      setInitialAmount('');
      setRate('2.5');
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); 

  useEffect(() => {
    if (success) {
      addToast('success', t('success'));
      onSuccess();
      onClose();
    }
  }, [success, addToast, onSuccess, onClose, t]);

  useEffect(() => {
    if (error) {
      if (error.includes('possède déjà une épargne')) {
        addToast('error', t('errors.alreadyHasSaving'));
      } else {
        addToast('error', error);
      }
    }
  }, [error, addToast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceAccountId) {
      addToast('error', t('errors.selectAccount'));
      return;
    }

    const amount = Number.parseFloat(initialAmount);
    if (Number.isNaN(amount) || amount < 10) {
      addToast('error', t('errors.minAmount'));
      return;
    }

    const rateValue = Number.parseFloat(rate);
    if (Number.isNaN(rateValue) || rateValue < 1.5 || rateValue > 3.5) {
      addToast('error', t('errors.invalidRate'));
      return;
    }

    await createSaving({
      sourceAccountId,
      savingProductId,
      initialAmount: amount,
      // rate: rateValue,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3" color="primary">
            {t('title')}
          </Typography>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sourceAccount" className="block text-sm font-medium text-gray-700 mb-1">
              {t('sourceAccount')} *
            </label>
            {accountsLoading ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {t('loadingAccounts')}
              </div>
            ) : (
              <select
                id="sourceAccount"
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-clean-primary focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">{t('selectAccount')}</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label} - {(account.balance).toFixed(2)}€
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="savingProduct" className="block text-sm font-medium text-gray-700 mb-1">
              {t('savingProduct')} *
            </label>
            {isLoading ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {t('loadingProducts')}
              </div>
            ) : (
              <select
                id="savingProduct"
                value={savingProductId}
                onChange={(e) => setSavingProductId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-clean-primary focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">{t('selectProduct')}</option>
                {availableSavingProducts.length === 0 && savingProducts && savingProducts.length > 0 ? (
                  <option value="" disabled>{t('allProductsUsed')}</option>
                ) : (
                  availableSavingProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.label} - {product.rate.toFixed(2)}%
                    </option>
                  ))
                )}
              </select>
            )}
            {availableSavingProducts.length === 0 && savingProducts && savingProducts.length > 0 && (
              <p className="text-sm text-orange-600 mt-2">
                {t('allProductsUsedMessage')}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700 mb-1">
              {t('initialAmount')} *
            </label>
            <input
              id="initialAmount"
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder={t('initialAmountPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-clean-primary focus:border-transparent"
              required
              min="10"
              step="0.01"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('minimumAmount')}
            </p>
          </div>

          {/* <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
              Taux d'intérêt annuel (%) *
            </label>
            <input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Ex: 2.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-clean-primary focus:border-transparent"
              required
              min="1.5"
              max="3.5"
              step="0.1"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Entre 1.5% et 3.5%
            </p>
          </div> */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl"></span>
              <div>
                <Typography variant="body" className="text-sm text-blue-800">
                  <strong>{t('howItWorks')}</strong>
                </Typography>
                <Typography variant="caption" className="text-blue-700 mt-1">
                  • {t('info1')}<br />
                  • {t('info2')}<br />
                  • {t('info3')}
                </Typography>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !sourceAccountId || !initialAmount}
            >
              {loading ? t('creating') : t('submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
