'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { OperationsHistorySkeleton } from '../../../../../components/molecules/OperationSkeleton';
import { useAuth } from '../../../../../contexts/AuthProvider';
import { useOperationsHistory } from '../../../../../features/operations/useOperationsHistory';
import { useGetAccounts } from '../../../../../features/account/useGetAccounts';
import { getOperationTypeLabel, getPaymentMethod, getOperationDescription } from '../../../../../lib/operationHelpers';
import { maskIBAN } from '../../../../../lib/formatters';
import type { OperationFilters } from '../../../../../infrastructure/web/services/operationService';

export default function OperationsHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { accounts, loading: accountsLoading } = useGetAccounts();
  
  const [filters, setFilters] = useState<OperationFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [accountsMap, setAccountsMap] = useState<Record<string, { label: string; iban: string }>>({});
  
  const { operations, loading, error, statistics, refetch } = useOperationsHistory(filters);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const map: Record<string, { label: string; iban: string }> = {};
      accounts.forEach(acc => {
        map[acc.id] = { label: acc.label, iban: acc.iban };
      });
      setAccountsMap(map);
    }
  }, [accounts]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <OperationsHistorySkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading && (!operations || operations.length === 0)) {
    return (
      <DashboardLayout>
        <OperationsHistorySkeleton />
      </DashboardLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOperationBadge = (direction: string, type: string) => {
    if (direction === 'INCOMING') {
      return {
        label: type === 'INTEREST' ? 'Intérêts' : 'Crédit',
        color: 'bg-green-100 text-green-800',
        icon: '↓',
      };
    }
    if (direction === 'OUTGOING') {
      return {
        label: 'Débit',
        color: 'bg-red-100 text-red-800',
        icon: '↑',
      };
    }
    return {
      label: 'Virement interne',
      color: 'bg-blue-100 text-blue-800',
      icon: '↔',
    };
  };

  const handleFilterChange = (key: keyof OperationFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTypeToggle = (type: string) => {
    setFilters((prev) => {
      const currentTypes = prev.type || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type];
      return {
        ...prev,
        type: newTypes.length > 0 ? newTypes : undefined,
      };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof OperationFilters];
    return value !== undefined && (Array.isArray(value) ? value.length > 0 : true);
  });

  if (loading || accountsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <Typography variant="h4" className="mb-2 text-red-700">
            Erreur
          </Typography>
          <Typography color="muted" className="mb-4">
            {error}
          </Typography>
          <Button variant="primary" onClick={refetch}>
            Réessayer
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              Historique des opérations
            </Typography>
            <Typography color="muted">
              {operations?.length || 0} opération{(operations?.length || 0) > 1 ? 's' : ''}
              {hasActiveFilters && ' (filtré)'}
            </Typography>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtres
              {hasActiveFilters && (
                <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={refetch}>
              Actualiser
            </Button>
          </div>
        </div>

        {statistics && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-green-200">
              <div className="text-center">
                <Typography variant="caption" color="muted" className="mb-2">
                  Total crédits
                </Typography>
                <Typography variant="h3" className="text-green-600 font-bold">
                  +{formatCurrency(statistics.totalCredit)}
                </Typography>
              </div>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <div className="text-center">
                <Typography variant="caption" color="muted" className="mb-2">
                  Total débits
                </Typography>
                <Typography variant="h3" className="text-red-600 font-bold">
                  -{formatCurrency(statistics.totalDebit)}
                </Typography>
              </div>
            </Card>

            <Card className={`${statistics.netBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="text-center">
                <Typography variant="caption" color="muted" className="mb-2">
                  Solde net
                </Typography>
                <Typography
                  variant="h3"
                  className={`font-bold ${statistics.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}
                >
                  {statistics.netBalance >= 0 ? '+' : ''}{formatCurrency(statistics.netBalance)}
                </Typography>
              </div>
            </Card>
          </div>
        )}

        {showFilters && (
          <Card className="bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h4">Filtres</Typography>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Effacer tout
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Typography variant="caption" className="mb-2 block font-medium">
                  Type d'opération
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {['CREDIT', 'DEBIT', 'TRANSFER', 'INTEREST'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.type?.includes(type)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {type === 'CREDIT' && 'Crédit'}
                      {type === 'DEBIT' && 'Débit'}
                      {type === 'TRANSFER' && 'Virement'}
                      {type === 'INTEREST' && 'Intérêts'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="caption" className="mb-2 block font-medium">
                  Compte
                </Typography>
                <select
                  value={filters.accountId || ''}
                  onChange={(e) => handleFilterChange('accountId', e.target.value || undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les comptes</option>
                  {accounts?.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Typography variant="caption" className="mb-2 block font-medium">
                  Du
                </Typography>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <Typography variant="caption" className="mb-2 block font-medium">
                  Au
                </Typography>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <Typography variant="caption" className="mb-2 block font-medium">
                  Montant min (€)
                </Typography>
                <input
                  type="number"
                  value={filters.amountMin || ''}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                  placeholder="Ex: 10"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <Typography variant="caption" className="mb-2 block font-medium">
                  Montant max (€)
                </Typography>
                <input
                  type="number"
                  value={filters.amountMax || ''}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                  placeholder="Ex: 1000"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>
        )}

        {operations && operations.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">Description</th>
                    <th className="text-left p-4 font-semibold">Moyen de paiement</th>
                    <th className="text-left p-4 font-semibold">Compte associé</th>
                    <th className="text-right p-4 font-semibold">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((op) => {
                    const badge = getOperationBadge(op.direction, op.type);
                    const isPositive = op.direction === 'INCOMING';
                    const otherAccountId = isPositive ? op.fromAccountId : op.toAccountId;
                    const otherAccount = otherAccountId ? accountsMap[otherAccountId] : null;
                    const operationType = getOperationTypeLabel(op.type);
                    const paymentMethod = getPaymentMethod(op.type, isPositive);
                    const description = getOperationDescription({
                      label: op.description || 'Sans description',
                      type: op.type,
                      fromAccountLabel: isPositive && otherAccount ? otherAccount.label : undefined,
                      toAccountLabel: !isPositive && otherAccount ? otherAccount.label : undefined,
                      isCredit: isPositive,
                    });

                    return (
                      <tr key={op.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <Typography variant="caption" color="muted" className="whitespace-nowrap">
                            {formatDate(op.createdAt)}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${badge.color}`}>
                            <span>{badge.icon}</span>
                            {badge.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <Typography variant="body" className="font-medium">
                              {description}
                            </Typography>
                            <Typography variant="caption" color="muted" className="text-xs">
                              {operationType}
                            </Typography>
                          </div>
                        </td>
                        <td className="p-4">
                          <Typography variant="caption" className="text-sm">
                            {paymentMethod}
                          </Typography>
                        </td>
                        <td className="p-4">
                          {otherAccount ? (
                            <div className="flex flex-col space-y-1">
                              <Typography variant="caption" className="font-medium text-sm">
                                {isPositive ? 'De: ' : 'Vers: '}
                                {otherAccount.label}
                              </Typography>
                              <Typography variant="caption" color="muted" className="text-xs font-mono">
                                {maskIBAN(otherAccount.iban)}
                              </Typography>
                            </div>
                          ) : (
                            <Typography variant="caption" color="muted">
                              —
                            </Typography>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Typography
                            variant="body"
                            className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {isPositive ? '+' : '-'}{formatCurrency(op.amount)}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <Typography variant="h4" className="mb-2">
              Aucune opération trouvée
            </Typography>
            <Typography color="muted" className="mb-6">
              {hasActiveFilters
                ? 'Essayez de modifier vos filtres pour voir plus de résultats'
                : 'Aucune opération n\'a été effectuée pour le moment'}
            </Typography>
            {hasActiveFilters && (
              <Button variant="primary" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
