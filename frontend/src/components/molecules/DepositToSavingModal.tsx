'use client';

import { useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { savingService } from '@/infrastructure/web/services/savingService';
import { AccountDTO } from '@/infrastructure/web/types';

interface DepositToSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  savingId: string;
  accounts: AccountDTO[];
}

export function DepositToSavingModal({
  isOpen,
  onClose,
  onSuccess,
  savingId,
  accounts,
}: DepositToSavingModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAccountId) {
      setError('Veuillez sélectionner un compte source');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    const sourceAccount = accounts.find(acc => acc.id === selectedAccountId);
    if (sourceAccount && numAmount > sourceAccount.balance) {
      setError('Montant supérieur au solde disponible du compte source');
      return;
    }

    setIsLoading(true);

    try {
      await savingService.depositToSaving(savingId, selectedAccountId, numAmount);
      onSuccess();
      onClose();
      setAmount('');
      setSelectedAccountId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du dépôt');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <Typography variant="h2" className="mb-4">
          Alimenter l&apos;épargne
        </Typography>

        {selectedAccount && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <Typography variant="caption" color="muted" className="block mb-1">
              Solde disponible du compte source
            </Typography>
            <Typography variant="h3" className="text-blue-700">
              {formatCurrency(selectedAccount.balance)}
            </Typography>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              <Typography variant="body" className="font-medium">
                Compte source
              </Typography>
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Sélectionner un compte</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.label} - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">
              <Typography variant="body" className="font-medium">
                Montant à déposer (€)
              </Typography>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <Typography variant="body" className="text-red-700">
                {error}
              </Typography>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Dépôt en cours...' : 'Confirmer le dépôt'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
