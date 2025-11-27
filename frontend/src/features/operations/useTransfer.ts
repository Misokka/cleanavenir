import { useState, useCallback } from 'react';
import { operationService } from '@/infrastructure/web/services/operationService';
import { MutationState } from '@/infrastructure/web/types';
import { useToast } from '@/contexts/ToastProvider';

interface TransferPayload {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

export function useTransfer() {
  const toast = useToast();
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const transfer = useCallback(async (payload: TransferPayload): Promise<boolean> => {
    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const result = await operationService.transfer(payload);
      
      setState({
        loading: false,
        error: null,
        success: result.success,
      });

      if (result.success) {
        toast.success('Virement effectué avec succès');
      }

      return result.success;
    } catch (error) {
      let errorMessage = 'Erreur lors du virement';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        loading: false,
        error: errorMessage,
        success: false,
      });

      toast.error(errorMessage);

      return false;
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
    transfer,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}
