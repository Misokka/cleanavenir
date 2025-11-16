'use client';

import { useState, useCallback } from 'react';
import { accountService } from '../../infrastructure/web/services/accountService';
import { AccountDTO } from '../../infrastructure/web/types';

interface MutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateAccount() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createAccount = useCallback(async (name: string): Promise<AccountDTO | null> => {
    setState({ loading: true, error: null, success: false });

    try {
      const newAccount = await accountService.createAccount({ name });
      setState({ loading: false, error: null, success: true });
      return newAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du compte';
      setState({ loading: false, error: errorMessage, success: false });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    createAccount,
    loading: state.loading,
    error: state.error,
    success: state.success,
    reset,
  };
}
