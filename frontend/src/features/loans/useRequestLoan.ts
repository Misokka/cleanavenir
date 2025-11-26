'use client';

import { useState } from 'react';
import { loanService, type LoanDTO, type RequestLoanRequest } from '@/infrastructure/web/services/loanService';
import { useToast } from '@/contexts/ToastProvider';

export function useRequestLoan() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestLoan = async (data: RequestLoanRequest): Promise<LoanDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await loanService.requestLoan(data);
      setSuccess(true);
      toast.success('Demande de prêt envoyée avec succès');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la demande de prêt';
      setError(message);
      toast.error(message);
      console.error('Error requesting loan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    requestLoan,
    loading,
    error,
    success,
    reset,
  };
}
