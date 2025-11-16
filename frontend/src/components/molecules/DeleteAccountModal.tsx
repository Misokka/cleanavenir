'use client';

import { useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useDeleteAccount } from '../../features/account/useDeleteAccount';
import { useToast } from '../../contexts/ToastProvider';
import type { AccountDTO } from '../../infrastructure/web/types';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  account: AccountDTO;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  account,
}) => {
  const { deleteAccount, loading, error, success, reset } = useDeleteAccount();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (success) {
      addToast('success', 'Compte supprimé avec succès !');
      onSuccess();
      onClose();
    }
  }, [success, addToast, onSuccess, onClose]);

  useEffect(() => {
    if (error) {
      addToast('error', error);
    }
  }, [error, addToast]);

  const handleDelete = async () => {
    await deleteAccount(account.id);
  };

  if (!isOpen) return null;

  const hasBalance = account.balance !== 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3" className="text-red-600">
            Supprimer le compte
          </Typography>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-red-500 text-2xl"></span>
              <div>
                <Typography variant="body" className="text-red-800 font-semibold">
                  Attention : Cette action est irréversible !
                </Typography>
                <Typography variant="caption" className="text-red-700 mt-1">
                  Le compte "{account.label}" sera définitivement supprimé.
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <Typography variant="body" className="text-sm text-gray-700">
              <strong>Compte :</strong> {account.label}
            </Typography>
            <Typography variant="body" className="text-sm text-gray-700 mt-1">
              <strong>IBAN :</strong> {account.iban}
            </Typography>
            <Typography variant="body" className="text-sm text-gray-700 mt-1">
              <strong>Solde :</strong>{' '}
              <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: account.currency,
                }).format(account.balance)}
              </span>
            </Typography>
          </div>

          {hasBalance && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-500 text-xl"></span>
                <div>
                  <Typography variant="body" className="text-sm text-yellow-800 font-semibold">
                    Impossible de supprimer ce compte
                  </Typography>
                  <Typography variant="caption" className="text-yellow-700 mt-1">
                    Le solde doit être à zéro avant de pouvoir supprimer le compte.
                    Veuillez transférer les fonds vers un autre compte.
                  </Typography>
                </div>
              </div>
            </div>
          )}

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
              type="button"
              variant="primary"
              onClick={handleDelete}
              disabled={loading || hasBalance}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
            >
              {loading ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
