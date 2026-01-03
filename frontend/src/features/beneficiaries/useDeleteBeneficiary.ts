import { useState, useCallback } from 'react';
import { beneficiaryService } from '@/infrastructure/web/services/beneficiaryService';
import { MutationState } from '@/infrastructure/web/types';
import { useToast } from '@/contexts/ToastProvider';

export function useDeleteBeneficiary() {
  const toast = useToast();
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const deleteBeneficiary = useCallback(async (id: string): Promise<boolean> => {
    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      await beneficiaryService.deleteBeneficiary(id);
      
      setState({
        loading: false,
        error: null,
        success: true,
      });

      toast.success('Bénéficiaire supprimé avec succès');

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur lors de la suppression du bénéficiaire';
      
      setState({
        loading: false,
        error: errorMessage,
        success: false,
      });

      toast.error(errorMessage);

      return false;
    }
  }, [toast]);

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    deleteBeneficiary,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}
