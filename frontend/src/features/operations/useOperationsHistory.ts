import { useState, useEffect, useCallback } from 'react';
import { operationService, type OperationFilters, type OperationWithDirection } from '@/infrastructure/web/services/operationService';

export function useOperationsHistory(filters?: OperationFilters) {
  const [operations, setOperations] = useState<OperationWithDirection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOperations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await operationService.getOperationsHistory(filters);
      setOperations(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de l\'historique';
      setError(message);
      console.error('Error fetching operations history:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const statistics = operations
    ? {
        totalCredit: operations
          .filter((op) => op.direction === 'INCOMING')
          .reduce((sum, op) => sum + op.amount, 0),
        totalDebit: operations
          .filter((op) => op.direction === 'OUTGOING')
          .reduce((sum, op) => sum + op.amount, 0),
        netBalance: 0,
        count: operations.length,
      }
    : null;

  if (statistics) {
    statistics.netBalance = statistics.totalCredit - statistics.totalDebit;
  }

  return {
    operations,
    loading,
    error,
    statistics,
    refetch: fetchOperations,
  };
}
