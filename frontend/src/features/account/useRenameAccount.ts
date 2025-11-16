'use client';

import { useState, useCallback } from 'react';
import { accountService } from '../../infrastructure/web/services/accountService';
import { AccountDTO } from '../../infrastructure/web/types';

interface MutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useRenameAccount() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const renameAccount = useCallback(async (
    accountId: string, 
    newName: string
  ): Promise<AccountDTO | null> => {
    setState({ loading: true, error: null, success: false });

    try {
      const updatedAccount = await accountService.renameAccount(accountId, newName);
      setState({ loading: false, error: null, success: true });
      return updatedAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du renommage du compte';
      setState({ loading: false, error: errorMessage, success: false });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    renameAccount,
    loading: state.loading,
    error: state.error,
    success: state.success,
    reset,
  };
}
