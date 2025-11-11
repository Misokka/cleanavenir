'use client';

import { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useRenameAccount } from '../../features/account/useRenameAccount';
import { useToast } from '../../contexts/ToastProvider';
import type { AccountDTO } from '../../infrastructure/web/types';

interface RenameAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  account: AccountDTO;
}

export const RenameAccountModal: React.FC<RenameAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  account,
}) => {
  const [name, setName] = useState('');
  const { renameAccount, loading, error, success, reset } = useRenameAccount();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && account) {
      setName(account.label);
      reset();
    }
  }, [isOpen, account, reset]);

  useEffect(() => {
    if (success) {
      addToast('success', 'Compte renommé avec succès !');
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
    
    if (name.trim().length < 3) {
      addToast('error', 'Le nom doit contenir au moins 3 caractères');
      return;
    }

    if (name.trim().length > 50) {
      addToast('error', 'Le nom ne peut pas dépasser 50 caractères');
      return;
    }

    await renameAccount(account.id, name.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3" color="primary">
            Renommer le compte
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau nom du compte *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Compte Courant Principal"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-clean-primary focus:border-transparent"
              required
              minLength={3}
              maxLength={50}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Entre 3 et 50 caractères
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">ℹ️</span>
              <div>
                <Typography variant="body" className="text-sm text-blue-800">
                  <strong>IBAN actuel :</strong> {account.iban}
                </Typography>
                <Typography variant="caption" className="text-blue-700 mt-1">
                  L'IBAN restera inchangé
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
              disabled={loading || name.trim().length < 3}
            >
              {loading ? 'Renommage...' : 'Renommer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
