'use client';

import { useState, useCallback } from 'react';
import { accountService } from '../../infrastructure/web/services/accountService';

interface MutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useDeleteAccount() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const deleteAccount = useCallback(async (accountId: string): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });

    try {
      await accountService.deleteAccount(accountId);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du compte';
      setState({ loading: false, error: errorMessage, success: false });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    deleteAccount,
    loading: state.loading,
    error: state.error,
    success: state.success,
    reset,
  };
}
