'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { RenameAccountModal } from '../../../../../components/molecules/RenameAccountModal';
import { DeleteAccountModal } from '../../../../../components/molecules/DeleteAccountModal';
import { RecentOperations } from '../../../../../components/organisms/RecentOperations';
import { useAuth } from '../../../../../contexts/AuthProvider';
import { useAccountWithOperations } from '../../../../../features/account/useAccountWithOperations';
import { formatCurrency, formatDate, maskIBAN } from '../../../../../lib/formatters';
import { formatIban } from '../../../../../utils/formatIban';
import { accountService } from '@/infrastructure/web';

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const accountId = params.id as string;
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { account, operations, loading, error, refetch } = useAccountWithOperations(accountId, 10);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !account) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <Typography variant="h4" className="mb-2 text-red-700">
            Erreur
          </Typography>
          <Typography color="muted" className="mb-4">
            {error || 'Compte introuvable'}
          </Typography>
          <Button variant="primary" onClick={() => router.push(`/${locale}/dashboard/accounts`)}>
            Retour aux comptes
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const getBalanceColor = (balance: number): string => {
    return balance >= 0 ? 'text-green-600' : 'text-red-500';
  };

  const handleDeleteSuccess = () => {
    router.push(`/${locale}/dashboard/accounts`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-clean-dark to-clean-secondary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-4xl"></span>
              <div>
                <Typography variant="h2" className="text-white mb-2">
                  {account.label}
                </Typography>
                <Typography variant="body" className="text-white opacity-90">
                  {maskIBAN(account.iban)}
                </Typography>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="caption" className="text-white opacity-75 mb-1">
                Solde
              </Typography>
              <Typography variant="h1" className={`font-bold ${getBalanceColor(account.balance)} text-white`}>
                {formatCurrency(account.balance, locale === 'fr' ? 'fr-FR' : 'en-US', account.currency)}
              </Typography>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              IBAN
            </Typography>
            <Typography variant="body" className="font-mono">
              {formatIban(account.iban)}
            </Typography>
          </Card>
          
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              Devise
            </Typography>
            <Typography variant="body">
              {account.currency}
            </Typography>
          </Card>
          
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              Identifiant
            </Typography>
            <Typography variant="body" className="font-mono text-sm">
              {account.id}
            </Typography>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            variant="primary"
            onClick={() => router.push(`/${locale}/dashboard/operations/transfer?from=${accountId}`)}
          >
            Effectuer un virement
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsRenameModalOpen(true)}
          >
            Renommer
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
           Supprimer
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                console.log('Téléchargement RIB pour compte:', params.id);
                const blob = await accountService.downloadRib(params.id as string);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `RIB-${account.label}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
              } catch (e) {
                console.error('Téléchargement du RIB échoué:', e);
                const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue';
                alert(`RIB introuvable ou indisponible: ${errorMessage}`);
              }
            }}
          >
            Télécharger le RIB
          </Button>
          <Button variant="outline">
            Historique complet
          </Button>
        </div>

        {account && (
          <>
            <RenameAccountModal
              isOpen={isRenameModalOpen}
              onClose={() => setIsRenameModalOpen(false)}
              onSuccess={refetch}
              account={account}
            />
            <DeleteAccountModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onSuccess={handleDeleteSuccess}
              account={account}
            />
          </>
        )}

        {operations && operations.length > 0 ? (
          <div>
            <Typography variant="h3" className="mb-4">
              Dernières opérations
            </Typography>
            <Card>
              <div className="divide-y divide-gray-200">
                {operations.map((operation) => {
                  const isCredit = operation.kind === 'CREDIT';
                  return (
                    <div key={operation.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">{isCredit ? '' : ''}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Typography variant="body" className="font-medium text-gray-900 mb-1">
                              {operation.label}
                            </Typography>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatDate(operation.createdAt, locale === 'fr' ? 'fr-FR' : 'en-US')}</span>
                              <span>•</span>
                              <span className={`capitalize ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                {isCredit ? 'Crédit' : 'Débit'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <Typography 
                            variant="body" 
                            className={`font-semibold ${isCredit ? 'text-green-600' : 'text-red-500'}`}
                          >
                            {isCredit ? '+' : '-'}{formatCurrency(operation.amount, locale === 'fr' ? 'fr-FR' : 'en-US', operation.currency)}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <Typography variant="h4" className="mb-2">
              Aucune opération
            </Typography>
            <Typography color="muted">
              Les opérations sur ce compte apparaîtront ici
            </Typography>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}