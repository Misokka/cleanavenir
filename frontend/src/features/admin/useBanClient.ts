'use client';

import { useState } from 'react';
import { adminService, type ClientDTO } from '@/infrastructure/web/services/adminService';
import { useToast } from '@/contexts/ToastProvider';

export function useBanClient() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const banClient = async (clientId: string): Promise<ClientDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await adminService.banClient(clientId);
      setSuccess(true);
      toast.success('Client banni avec succès');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du bannissement du client';
      setError(message);
      toast.error(message);
      console.error('Error banning client:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  async function unbanClient(clientId: string): Promise<ClientDTO | null> {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await adminService.unbanClient(clientId);
      setSuccess(true);
      toast.success('Client réintégré avec succès');
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du réintégration du client';
      setError(message);
      toast.error(message);
      console.error('Error unbanning client:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    banClient,
    unbanClient,
    loading,
    error,
    success,
    reset,
  };
}
