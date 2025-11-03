import { useState, useEffect, useCallback } from 'react';
import { accountService } from '@/infrastructure/web/services/accountService';
import { 
  AccountDTO, 
  AsyncState,
  PaginationParams,
  NotFoundError 
} from '@/infrastructure/web/types';

export function useGetAccounts(params?: PaginationParams) {
  const [state, setState] = useState<AsyncState<AccountDTO[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchAccounts = useCallback(async (fetchParams?: PaginationParams) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const accounts = await accountService.getAccounts(fetchParams);
      
      setState({
        data: accounts,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des comptes';
      
      if (error instanceof Error) {
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
    fetchAccounts(params);
  }, [fetchAccounts, params?.page, params?.limit, params?.sort, params?.order]);

  const refetch = useCallback(() => {
    fetchAccounts(params);
  }, [fetchAccounts, params]);

  return {
    accounts: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useGetAccountDetails(accountId: string | null) {
  const [state, setState] = useState<AsyncState<AccountDTO>>({
    data: null,
    loading: false,
    error: null,
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

  const refetch = useCallback(() => {
    if (accountId) {
      fetchAccountDetails(accountId);
    }
  }, [accountId, fetchAccountDetails]);

  return {
    account: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useAccountBalance(accountId: string | null) {
  const [state, setState] = useState<AsyncState<{ balance: number; currency: string }>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchBalance = useCallback(async (id: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const balanceData = await accountService.getAccountBalance(id);
      
      setState({
        data: balanceData,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération du solde';
      
      if (error instanceof NotFoundError) {
        errorMessage = 'Solde du compte introuvable';
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
      fetchBalance(accountId);
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, [accountId, fetchBalance]);

  const refetch = useCallback(() => {
    if (accountId) {
      fetchBalance(accountId);
    }
  }, [accountId, fetchBalance]);

  return {
    balance: state.data?.balance || 0,
    currency: state.data?.currency || 'EUR',
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useCreateAccount() {
  const [state, setState] = useState({
    loading: false,
    error: null as string | null,
    success: false,
  });

  const createAccount = useCallback(async (accountData: {
    label: string;
    currency?: string;
  }): Promise<AccountDTO | null> => {
    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const newAccount = await accountService.createAccount(accountData);
      
      setState({
        loading: false,
        error: null,
        success: true,
      });

      return newAccount;
    } catch (error) {
      let errorMessage = 'Erreur lors de la création du compte';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        loading: false,
        error: errorMessage,
        success: false,
      });

      return null;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    createAccount,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}