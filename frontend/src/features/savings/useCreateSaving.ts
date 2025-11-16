'use client';

import { useState } from 'react';
import { savingService, type SavingDTO, type CreateSavingRequest } from '../../infrastructure/web/services/savingService';

export function useCreateSaving() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createSaving = async (data: CreateSavingRequest): Promise<SavingDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await savingService.createSaving(data);
      setSuccess(true);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l\'épargne';
      setError(message);
      console.error('Error creating saving:', err);
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
    createSaving,
    loading,
    error,
    success,
    reset,
  };
}
