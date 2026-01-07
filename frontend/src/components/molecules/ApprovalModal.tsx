'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { advisorService, BankAccountDTO, ClientInfoDTO } from '@/infrastructure/web/services/advisorService';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};

interface ApprovalModalProps {
  loanId: string;
  clientId: string;
  loanAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export function ApprovalModal({
  loanId,
  clientId,
  loanAmount,
  onConfirm,
  onCancel,
  isProcessing,
}: ApprovalModalProps) {
  const [accounts, setAccounts] = useState<BankAccountDTO[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [clientInfo, setClientInfo] = useState<ClientInfoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [accountsData, infoData] = await Promise.all([
        advisorService.getClientAccounts(clientId),
        advisorService.getClientInfo(clientId),
      ]);
      
      setAccounts(accountsData.accounts);
      setTotalBalance(accountsData.totalBalance);
      setClientInfo(infoData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des données du client';
      setError(errorMessage);
      console.error('Erreur détaillée:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const repaymentCapacity = totalBalance / loanAmount;
  const canRepay = repaymentCapacity >= 0.3; // Au moins 30% du prêt en épargne

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Typography variant="h2" className="mb-4">
          Validation du prêt
        </Typography>

        {loading ? (
          <div className="text-center py-8">
            <Typography variant="body" color="muted">
              Chargement des données du client...
            </Typography>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <Typography variant="body" className="text-red-800">
              {error}
            </Typography>
          </div>
        ) : (
          <>
            {clientInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <Typography variant="h3" className="mb-2">
                  Informations du client
                </Typography>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Typography variant="caption" color="muted" className="block">
                      Nom
                    </Typography>
                    <Typography variant="body" className="font-semibold">
                      {clientInfo.firstName} {clientInfo.lastName}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" color="muted" className="block">
                      Email
                    </Typography>
                    <Typography variant="body" className="font-semibold">
                      {clientInfo.email}
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <Typography variant="caption" color="muted" className="block mb-1">
                Montant du prêt demandé
              </Typography>
              <Typography variant="h2" className="text-blue-900">
                {formatCurrency(loanAmount / 100)}
              </Typography>
            </div>

            {/* Comptes bancaires */}
            <div className="mb-4">
              <Typography variant="h3" className="mb-3">
                Comptes bancaires du client
              </Typography>
              <div className="space-y-2">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <Typography variant="body" className="font-semibold">
                        {account.name}
                      </Typography>
                      <Typography variant="caption" color="muted">
                        {account.iban}
                      </Typography>
                    </div>
                    <Typography variant="body" className="font-bold">
                      {formatCurrency(account.balance / 100)}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="h3">
                  Solde total
                </Typography>
                <Typography variant="h2" className="text-green-700">
                  {formatCurrency(totalBalance / 100)}
                </Typography>
              </div>
              
              <div className="border-t border-gray-300 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="body" color="muted">
                    Capacité de remboursement
                  </Typography>
                  <Typography variant="body" className="font-semibold">
                    {(repaymentCapacity * 100).toFixed(0)}%
                  </Typography>
                </div>
                
                {canRepay ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-xl">✓</span>
                    <Typography variant="body" className="font-semibold">
                      Capacité de remboursement suffisante
                    </Typography>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Typography variant="body" className="font-semibold">
                      Attention : Capacité de remboursement limitée
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={onConfirm}
                disabled={isProcessing}
                className={canRepay ? '' : 'bg-orange-600 hover:bg-orange-700'}
              >
                {isProcessing ? 'Approbation...' : 'Confirmer l\'approbation'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
