import { useState, useEffect, useCallback } from 'react';
import { savingService } from '@/infrastructure/web/services/savingService';
import { 
  SavingAccountDTO, 
  SavingRateDTO, 
  AccountDTO,
  AsyncState,
  MutationState,
  NotFoundError 
} from '@/infrastructure/web/types';

export function useGetSavings() {
  const [state, setState] = useState<AsyncState<SavingAccountDTO[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchSavings = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const savings = await savingService.getSavingAccounts();
      
      setState({
        data: savings,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des comptes d\'épargne';
      
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
    fetchSavings();
  }, [fetchSavings]);

  const refetch = useCallback(() => {
    fetchSavings();
  }, [fetchSavings]);

  return {
    savings: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useGetSavingRates() {
  const [state, setState] = useState<AsyncState<SavingRateDTO[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRates = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const rates = await savingService.getCurrentSavingRates();
      
      setState({
        data: rates,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des taux d\'épargne';
      
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
    fetchRates();
  }, [fetchRates]);

  const refetch = useCallback(() => {
    fetchRates();
  }, [fetchRates]);

  return {
    rates: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useCurrentSavingRate() {
  const [state, setState] = useState<AsyncState<SavingRateDTO>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchCurrentRate = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const rate = await savingService.getCurrentSavingRate();
      
      setState({
        data: rate,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération du taux d\'épargne actuel';
      
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
    fetchCurrentRate();
  }, [fetchCurrentRate]);

  const refetch = useCallback(() => {
    fetchCurrentRate();
  }, [fetchCurrentRate]);

  return {
    currentRate: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useAccountsWithSavings() {
  const [state, setState] = useState<AsyncState<Array<AccountDTO & { savingAccount?: SavingAccountDTO }>>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchAccountsWithSavings = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const accountsWithSavings = await savingService.getAccountsWithSavings();
      
      setState({
        data: accountsWithSavings,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des comptes avec épargne';
      
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
    fetchAccountsWithSavings();
  }, [fetchAccountsWithSavings]);

  const refetch = useCallback(() => {
    fetchAccountsWithSavings();
  }, [fetchAccountsWithSavings]);

  return {
    accountsWithSavings: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useCreateSavingAccount() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createSavingAccount = useCallback(async (accountId: string): Promise<SavingAccountDTO | null> => {
    if (!accountId) {
      setState({
        loading: false,
        error: 'ID de compte requis',
        success: false,
      });
      return null;
    }

    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const newSavingAccount = await savingService.createSavingAccount({
        AccountId: accountId,
      });
      
      setState({
        loading: false,
        error: null,
        success: true,
      });

      return newSavingAccount;
    } catch (error) {
      let errorMessage = 'Erreur lors de la création du compte d\'épargne';
      
      if (error instanceof Error) {
        if (error.message.includes('déjà un produit')) {
          errorMessage = 'Ce compte possède déjà un produit d\'épargne';
        } else {
          errorMessage = error.message;
        }
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
    createSavingAccount,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}

export function useSavingInterests(savingAccountId: string | null) {
  const [state, setState] = useState<AsyncState<{
    principal: number;
    interestRate: number;
    calculatedInterest: number;
    period: string;
  }>>({
    data: null,
    loading: false,
    error: null,
  });

  const calculateInterests = useCallback(async (
    id: string, 
    period: 'monthly' | 'yearly' = 'yearly'
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const interests = await savingService.calculateSavingInterests(id, period);
      
      setState({
        data: interests,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors du calcul des intérêts';
      
      if (error instanceof NotFoundError) {
        errorMessage = 'Compte d\'épargne introuvable';
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
    if (savingAccountId) {
      calculateInterests(savingAccountId, 'yearly');
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, [savingAccountId, calculateInterests]);

  const recalculate = useCallback((period: 'monthly' | 'yearly' = 'yearly') => {
    if (savingAccountId) {
      calculateInterests(savingAccountId, period);
    }
  }, [savingAccountId, calculateInterests]);

  return {
    interests: state.data,
    loading: state.loading,
    error: state.error,
    recalculate,
  };
}