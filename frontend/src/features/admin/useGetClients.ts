'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService, type ClientDTO } from '@/infrastructure/web/services/adminService';

export function useGetClients() {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await adminService.getClients();
      setClients(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des clients';
      setError(message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
  };
}
