'use client';

import { useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { savingService } from '@/infrastructure/web/services/savingService';
import { AccountDTO } from '@/infrastructure/web/types';

interface TransferFromSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  savingId: string;
  savingBalance: number;
  accounts: AccountDTO[];
}

export function TransferFromSavingModal({
  isOpen,
  onClose,
  onSuccess,
  savingId,
  savingBalance,
  accounts,
}: TransferFromSavingModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAccountId) {
      setError('Veuillez sélectionner un compte de destination');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    // savingBalance et numAmount sont tous les deux en euros
    if (numAmount > savingBalance) {
      setError('Montant supérieur au solde disponible');
      return;
    }

    setIsLoading(true);

    try {
      await savingService.transferFromSaving(savingId, selectedAccountId, numAmount);
      onSuccess();
      onClose();
      setAmount('');
      setSelectedAccountId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du transfert');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <Typography variant="h2" className="mb-4">
          Transférer vers un compte
        </Typography>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <Typography variant="caption" color="muted" className="block mb-1">
            Solde disponible
          </Typography>
          <Typography variant="h3" className="text-green-700">
            {formatCurrency(savingBalance)}
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              <Typography variant="body" className="font-medium">
                Compte de destination
              </Typography>
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clean-primary focus:border-clean-primary"
              disabled={isLoading}
            >
              <option value="">-- Sélectionner un compte --</option>
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
                Montant à transférer (€)
              </Typography>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={savingBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clean-primary focus:border-clean-primary"
              disabled={isLoading}
            />
            <Typography variant="caption" color="muted" className="mt-1">
              Maximum: {formatCurrency(savingBalance)}
            </Typography>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <Typography variant="body" className="text-red-700">
                {error}
              </Typography>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Transfert...' : 'Confirmer le transfert'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
