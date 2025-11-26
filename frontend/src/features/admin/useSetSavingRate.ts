import { useState } from 'react';
import { adminService } from '@/infrastructure/web/services/adminService';
import { useToast } from '@/contexts/ToastProvider';

export const useSetSavingRate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const setSavingRate = async (baseRate: number, premiumRate: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await adminService.setSavingRate(baseRate, premiumRate);
      showToast('Taux d\'intérêt mis à jour avec succès', 'success');
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de la mise à jour du taux';
      setError(err instanceof Error ? err : new Error(errorMessage));
      showToast(errorMessage, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    setSavingRate,
    isLoading,
    error,
  };
};
