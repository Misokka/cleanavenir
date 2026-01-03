import { useState, useEffect, useCallback } from 'react';
import { beneficiaryService, BeneficiaryDTO } from '@/infrastructure/web/services/beneficiaryService';
import { AsyncState } from '@/infrastructure/web/types';

export function useGetBeneficiaries() {
  const [state, setState] = useState<AsyncState<BeneficiaryDTO[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchBeneficiaries = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const beneficiaries = await beneficiaryService.listBeneficiaries();
      
      setState({
        data: beneficiaries,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erreur lors de la récupération des bénéficiaires';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  const refetch = useCallback(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  return {
    beneficiaries: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}
