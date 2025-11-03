import { useState, useEffect, useCallback } from 'react';
import { accountService } from '@/infrastructure/web/services/accountService';
import { 
  AccountDTO, 
  AsyncState,
  NotFoundError,
  MutationState 
} from '@/infrastructure/web/types';

export function useAccountDetails(accountId: string | null) {
  const [state, setState] = useState<AsyncState<AccountDTO>>({
    data: null,
    loading: false,
    error: null,
  });

  const [updateState, setUpdateState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const fetchAccountDetails = useCallback(async (id: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const account = await accountService.getAccountDetails(id);
      
      setState({
        data: account,
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

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchAccountDetails(accountId);
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, [accountId, fetchAccountDetails]);

  const updateAccountLabel = useCallback(async (newLabel: string): Promise<boolean> => {
    if (!accountId) {
      setUpdateState({
        loading: false,
        error: 'ID de compte requis',
        success: false,
      });
      return false;
    }

    setUpdateState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const updatedAccount = await accountService.updateAccount(accountId, {
        label: newLabel,
      });

      setState(prev => ({
        ...prev,
        data: updatedAccount,
      }));

      setUpdateState({
        loading: false,
        error: null,
        success: true,
      });

      return true;
    } catch (error) {
      let errorMessage = 'Erreur lors de la mise à jour du compte';
      
      if (error instanceof NotFoundError) {
        errorMessage = 'Compte introuvable';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setUpdateState({
        loading: false,
        error: errorMessage,
        success: false,
      });

      return false;
    }
  }, [accountId]);

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    if (!accountId) {
      setUpdateState({
        loading: false,
        error: 'ID de compte requis',
        success: false,
      });
      return false;
    }

    setUpdateState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      await accountService.deleteAccount(accountId);

      setState({
        data: null,
        loading: false,
        error: null,
      });

      setUpdateState({
        loading: false,
        error: null,
        success: true,
      });

      return true;
    } catch (error) {
      let errorMessage = 'Erreur lors de la suppression du compte';
      
      if (error instanceof NotFoundError) {
        errorMessage = 'Compte introuvable';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setUpdateState({
        loading: false,
        error: errorMessage,
        success: false,
      });

      return false;
    }
  }, [accountId]);

  const refetch = useCallback(() => {
    if (accountId) {
      fetchAccountDetails(accountId);
    }
  }, [accountId, fetchAccountDetails]);

  const resetUpdateState = useCallback(() => {
    setUpdateState({
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    account: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
    updateAccountLabel,
    deleteAccount,
    updating: updateState.loading,
    updateError: updateState.error,
    updateSuccess: updateState.success,
    resetUpdateState,
  };
}

export function useAccountStats(accounts: AccountDTO[] | null) {
  const [stats, setStats] = useState({
    totalBalance: 0,
    accountsCount: 0,
    averageBalance: 0,
    positiveBalanceCount: 0,
    negativeBalanceCount: 0,
  });

  useEffect(() => {
    if (!accounts || accounts.length === 0) {
      setStats({
        totalBalance: 0,
        accountsCount: 0,
        averageBalance: 0,
        positiveBalanceCount: 0,
        negativeBalanceCount: 0,
      });
      return;
    }

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const accountsCount = accounts.length;
    const averageBalance = totalBalance / accountsCount;
    const positiveBalanceCount = accounts.filter(account => account.balance > 0).length;
    const negativeBalanceCount = accounts.filter(account => account.balance < 0).length;

    setStats({
      totalBalance,
      accountsCount,
      averageBalance,
      positiveBalanceCount,
      negativeBalanceCount,
    });
  }, [accounts]);

  return stats;
}