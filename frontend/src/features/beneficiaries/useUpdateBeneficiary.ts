import { useState, useCallback } from 'react';
import { beneficiaryService, UpdateBeneficiaryLabelDTO, BeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';
import { MutationState } from '@/infrastructure/web/types';
import { useToast } from '@/contexts/ToastProvider';

export function useUpdateBeneficiary() {
  const toast = useToast();
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const updateBeneficiaryLabel = useCallback(async (
    id: string, 
    data: UpdateBeneficiaryLabelDTO
  ): Promise<BeneficiaryDTO | null> => {
    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const updatedBeneficiary = await beneficiaryService.updateBeneficiaryLabel(id, data);
      
      setState({
        loading: false,
        error: null,
        success: true,
      });

      toast.success('Bénéficiaire modifié avec succès');

      return updatedBeneficiary;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur lors de la modification du bénéficiaire';
      
      setState({
        loading: false,
        error: errorMessage,
        success: false,
      });

      toast.error(errorMessage);

      return null;
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
    updateBeneficiaryLabel,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}
