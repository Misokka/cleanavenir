'use client';

import { useState } from 'react';
import { loanService, type LoanSimulation, type SimulateLoanRequest } from '@/infrastructure/web/services/loanService';

export function useSimulateLoan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<LoanSimulation | null>(null);

  const simulate = async (data: SimulateLoanRequest): Promise<LoanSimulation | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loanService.simulateLoan(data);
      setSimulation(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la simulation du prêt';
      setError(message);
      console.error('Error simulating loan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSimulation(null);
    setLoading(false);
  };

  return {
    simulate,
    loading,
    error,
    simulation,
    reset,
  };
}
