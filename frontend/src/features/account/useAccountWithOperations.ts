import { useState, useEffect, useCallback } from 'react';
import { accountService } from '@/infrastructure/web/services/accountService';
import { 
  AccountDTO, 
  OperationDTO,
  AsyncState,
  NotFoundError 
} from '@/infrastructure/web/types';

export function useAccountWithOperations(accountId: string | null, operationsLimit: number = 10) {
  const [accountState, setAccountState] = useState<AsyncState<AccountDTO>>({
    data: null,
    loading: false,
    error: null,
  });

  const [operationsState, setOperationsState] = useState<AsyncState<OperationDTO[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchAccountWithOperations = useCallback(async (id: string, limit: number) => {
    setAccountState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    setOperationsState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const [account, operations] = await Promise.all([
        accountService.getAccountDetails(id),
        accountService.getAccountOperations(id, { limit })
      ]);
      
      setAccountState({
        data: account,
        loading: false,
        error: null,
      });

      setOperationsState({
        data: operations,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des détails du compte';
      
      if (error instanceof NotFoundError) {
        errorMessage = 'Compte introuvable';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAccountState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      setOperationsState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchAccountWithOperations(accountId, operationsLimit);
    } else {
      setAccountState({
        data: null,
        loading: false,
        error: null,
      });

      setOperationsState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, [accountId, operationsLimit, fetchAccountWithOperations]);

  const refetch = useCallback((limit?: number) => {
    if (accountId) {
      fetchAccountWithOperations(accountId, limit || operationsLimit);
    }
  }, [accountId, operationsLimit, fetchAccountWithOperations]);

  return {
    account: accountState.data,
    operations: operationsState.data || [],
    loading: accountState.loading || operationsState.loading,
    error: accountState.error || operationsState.error,
    refetch,
  };
}
