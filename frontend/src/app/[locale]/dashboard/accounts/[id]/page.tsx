'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { RenameAccountModal } from '../../../../../components/molecules/RenameAccountModal';
import { DeleteAccountModal } from '../../../../../components/molecules/DeleteAccountModal';
import { AccountDetailSkeleton } from '../../../../../components/molecules/AccountSkeleton';
import { useAuth } from '../../../../../contexts/AuthProvider';
import { useAccountWithOperations } from '../../../../../features/account/useAccountWithOperations';
import { formatCurrency, formatDate, maskIBAN } from '../../../../../lib/formatters';
import { formatIban } from '../../../../../utils/formatIban';
import { getOperationTypeLabel, getPaymentMethod, getOperationDescription } from '../../../../../lib/operationHelpers';
import { accountService } from '@/infrastructure/web';

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const accountId = params.id as string;
  const tDetail = useTranslations('Dashboard.accounts.detail');
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [displayLimit, setDisplayLimit] = useState(10);
  const { account, operations, loading, error, refetch } = useAccountWithOperations(accountId, displayLimit);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountsMap, setAccountsMap] = useState<Record<string, { label: string; iban: string }>>({});

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const allAccounts = await accountService.getAccounts();
        const map: Record<string, { label: string; iban: string }> = {};
        allAccounts.forEach(acc => {
          map[acc.id] = { label: acc.label, iban: acc.iban };
        });
        setAccountsMap(map);
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      }
    };
    if (isAuthenticated) {
      fetchAccounts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <AccountDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <AccountDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !account) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <Typography variant="h4" className="mb-2 text-red-700">
            {tDetail('errorTitle')}
          </Typography>
          <Typography color="muted" className="mb-4">
            {error || tDetail('notFound')}
          </Typography>
          <Button variant="primary" onClick={() => router.push(`/${locale}/dashboard/accounts`)}>
            {tDetail('backToAccounts')}
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
                {tDetail('balance')}
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
              {tDetail('iban')}
            </Typography>
            <Typography variant="body" className="font-mono">
              {formatIban(account.iban)}
            </Typography>
          </Card>
          
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              {tDetail('currency')}
            </Typography>
            <Typography variant="body">
              {account.currency}
            </Typography>
          </Card>
          
          <Card>
            <Typography variant="caption" color="muted" className="mb-2">
              {tDetail('identifier')}
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
            {tDetail('makeTransfer')}
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsRenameModalOpen(true)}
          >
            {tDetail('rename')}
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
           {tDetail('delete')}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                console.log('RIB download for account:', params.id);
                const blob = await accountService.downloadRib(params.id as string);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `RIB-${account.label}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
              } catch (e) {
                console.error(tDetail('ribDownloadFailed') + ':', e);
                const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                alert(tDetail('ribUnavailable', { message: errorMessage }));
              }
            }}
          >
            {tDetail('downloadRib')}
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
              {tDetail('latestOperations')}
            </Typography>
            <Card>
              <div className="divide-y divide-gray-200">
                {operations.map((operation) => {
                  const isCredit = operation.kind === 'CREDIT';
                  const otherAccountId = isCredit ? operation.fromAccountId : operation.toAccountId;
                  const otherAccount = otherAccountId ? accountsMap[otherAccountId] : null;
                  const operationType = getOperationTypeLabel(operation.type);
                  const paymentMethod = getPaymentMethod(operation.type, isCredit);
                  const description = getOperationDescription({
                    label: operation.label,
                    type: operation.type,
                    fromAccountLabel: isCredit && otherAccount ? otherAccount.label : undefined,
                    toAccountLabel: !isCredit && otherAccount ? otherAccount.label : undefined,
                    isCredit,
                  });
                  
                  return (
                    <div key={operation.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCredit ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <span className="text-xl">{isCredit ? '↓' : '↑'}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Typography variant="body" className="font-semibold text-gray-900">
                                {description}
                              </Typography>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                isCredit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {isCredit ? tDetail('credit') : tDetail('debit')}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">{tDetail('type')}</span>
                                <span>{operationType}</span>
                                <span>•</span>
                                <span className="text-gray-500">{paymentMethod}</span>
                              </div>
                              
                              {otherAccount && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium text-gray-600">
                                    {isCredit ? tDetail('from') : tDetail('to')}
                                  </span>
                                  <span className="text-gray-900">{otherAccount.label}</span>
                                  <span className="text-xs font-mono text-gray-500">
                                    ({maskIBAN(otherAccount.iban)})
                                  </span>
                                </div>
                              )}
                              
                              <div className="text-xs text-gray-500">
                                {formatDate(operation.createdAt, locale === 'fr' ? 'fr-FR' : 'en-US')}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 text-right">
                          <Typography 
                            variant="h4" 
                            className={`font-bold ${isCredit ? 'text-green-600' : 'text-red-500'}`}
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
            {displayLimit === 10 && operations.length >= 10 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setDisplayLimit(50)}
                  className="w-full md:w-auto"
                >
                  {tDetail('seeAll')}
                </Button>
              </div>
            )}
            {displayLimit > 10 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setDisplayLimit(10)}
                  className="w-full md:w-auto"
                >
                  {tDetail('seeLess')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <Typography variant="h4" className="mb-2">
              {tDetail('noOperationsTitle')}
            </Typography>
            <Typography color="muted">
              {tDetail('noOperationsHint')}
            </Typography>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}