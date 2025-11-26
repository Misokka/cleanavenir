'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService, type StatisticsDTO } from '@/infrastructure/web/services/adminService';

export function useGetStatistics() {
  const [statistics, setStatistics] = useState<StatisticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getStatistics();
      setStatistics(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques';
      setError(message);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}
