'use client';

import { useState, useEffect, useCallback } from 'react';
import { loanService, type LoanDTO } from '@/infrastructure/web/services/loanService';

export function useGetLoans() {
  const [loans, setLoans] = useState<LoanDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loanService.getLoans();
      setLoans(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des prêts';
      setError(message);
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    loans,
    loading,
    error,
    refetch: fetchLoans,
  };
}
