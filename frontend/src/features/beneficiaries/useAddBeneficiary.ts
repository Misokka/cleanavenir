import { useState, useCallback } from 'react';
import { beneficiaryService, CreateBeneficiaryDTO, BeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';
import { MutationState } from '@/infrastructure/web/types';
import { useToast } from '@/contexts/ToastProvider';

export function useAddBeneficiary() {
  const toast = useToast();
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const addBeneficiary = useCallback(async (data: CreateBeneficiaryDTO): Promise<BeneficiaryDTO | null> => {
    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const newBeneficiary = await beneficiaryService.addBeneficiary(data);
      
      setState({
        loading: false,
        error: null,
        success: true,
      });

      toast.success('Bénéficiaire ajouté avec succès');

      return newBeneficiary;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur lors de l\'ajout du bénéficiaire';
      
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
    addBeneficiary,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}
