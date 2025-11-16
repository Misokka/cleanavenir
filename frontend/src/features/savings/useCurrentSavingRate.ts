'use client';

import { useState, useEffect, useCallback } from 'react';
import { savingService, type CurrentRateDTO } from '../../infrastructure/web/services/savingService';

export function useCurrentSavingRate() {
  const [currentRate, setCurrentRate] = useState<CurrentRateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentRate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await savingService.getCurrentRate();
      setCurrentRate(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération du taux';
      setError(message);
      console.error('Error fetching current rate:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentRate();
  }, [fetchCurrentRate]);

  return {
    currentRate,
    loading,
    error,
    refetch: fetchCurrentRate,
  };
}
