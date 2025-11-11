'use client';

import { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useCreateSavingNew } from '../../features/savings/useGetSavings';
import { useGetAccounts } from '../../features/account/useGetAccounts';
import { useToast } from '../../contexts/ToastProvider';

interface CreateSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateSavingModal: React.FC<CreateSavingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [rate, setRate] = useState('2.5'); 

  const { accounts, loading: accountsLoading } = useGetAccounts();
  const { createSaving, loading, error, success, reset } = useCreateSavingNew();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSourceAccountId('');
      setInitialAmount('');
      setRate('2.5');
      reset();
    }
  }, [isOpen]); 

  useEffect(() => {
    if (success) {
      addToast('success', 'Compte épargne créé avec succès !');
      onSuccess();
      onClose();
    }
  }, [success, addToast, onSuccess, onClose]);

  useEffect(() => {
    if (error) {
      addToast('error', error);
    }
  }, [error, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceAccountId) {
      addToast('error', 'Veuillez sélectionner un compte source');
      return;
    }

    const amount = Number.parseFloat(initialAmount);
    if (Number.isNaN(amount) || amount < 10) {
      addToast('error', 'Le montant doit être d\'au moins 10€');
      return;
    }

    const rateValue = Number.parseFloat(rate);
    if (Number.isNaN(rateValue) || rateValue < 1.5 || rateValue > 3.5) {
      addToast('error', 'Le taux doit être compris entre 1.5% et 3.5%');
      return;
    }

    await createSaving({
      sourceAccountId,
      initialAmount: amount,
      rate: rateValue,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3" color="primary">
            Ouvrir une épargne
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
              Compte source *
            </label>
            {accountsLoading ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                Chargement des comptes...
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
                <option value="">Sélectionnez un compte</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label} - {(account.balance).toFixed(2)}€
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant initial (€) *
            </label>
            <input
              id="initialAmount"
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="Ex: 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-clean-primary focus:border-transparent"
              required
              min="10"
              step="0.01"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10€
            </p>
          </div>

          <div>
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
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl"></span>
              <div>
                <Typography variant="body" className="text-sm text-blue-800">
                  <strong>Fonctionnement :</strong>
                </Typography>
                <Typography variant="caption" className="text-blue-700 mt-1">
                  • Le montant sera débité de votre compte source<br />
                  • Les intérêts seront calculés et ajoutés chaque jour<br />
                  • Formule : solde × (taux / 365) par jour
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
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !sourceAccountId || !initialAmount}
            >
              {loading ? 'Création...' : 'Ouvrir l\'épargne'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
