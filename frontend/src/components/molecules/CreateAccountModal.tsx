'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useCreateAccount } from '../../features/account/useCreateAccount';
import { useToast } from '../../contexts/ToastProvider';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAccountModal({ isOpen, onClose, onSuccess }: CreateAccountModalProps) {
  const [accountName, setAccountName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createAccount, loading, error: createError, success, reset } = useCreateAccount();
  const toast = useToast();

  useEffect(() => {
    if (success) {
      toast.success('Compte créé avec succès ! 🎉');
      setAccountName('');
      setErrors({});
      reset();
      onSuccess();
      onClose();
    }
  }, [success, toast, reset, onSuccess, onClose]);

  useEffect(() => {
    if (createError) {
      toast.error(createError);
    }
  }, [createError, toast]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!accountName || accountName.trim().length === 0) {
      newErrors.accountName = 'Le nom du compte est requis';
    } else if (accountName.trim().length < 3) {
      newErrors.accountName = 'Le nom doit contenir au moins 3 caractères';
    } else if (accountName.trim().length > 50) {
      newErrors.accountName = 'Le nom ne peut pas dépasser 50 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await createAccount(accountName.trim());
  };

  const handleClose = () => {
    setAccountName('');
    setErrors({});
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h3" color="primary">
              Créer un nouveau compte
            </Typography>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du compte *
              </label>
              <input
                id="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.accountName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Compte Courant, Épargne, Vacances..."
                maxLength={50}
                autoFocus
              />
              {errors.accountName && (
                <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Minimum 3 caractères, maximum 50 caractères
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <Typography variant="body" className="text-blue-900 font-medium mb-1">
                    Informations importantes
                  </Typography>
                  <Typography variant="caption" className="text-blue-800">
                    • Un IBAN valide sera généré automatiquement<br />
                    • Le solde initial sera de 0 €<br />
                    • Vous pourrez renommer le compte ultérieurement
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !accountName.trim()}
                className="flex-1"
              >
                {loading ? 'Création en cours...' : 'Créer le compte'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
