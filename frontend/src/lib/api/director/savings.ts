import { httpClient } from '@/infrastructure/web/httpClient';

export interface SavingsRate {
  id: string;
  rate: number;
  effectiveDate: string;
  createdBy: string;
  createdAt: string;
}

export interface UpdateSavingsRatePayload {
  newRate: number;
  effectiveDate?: string;
  reason?: string;
}

export const getCurrentSavingsRate = async (): Promise<SavingsRate | null> => {
  try {
    const response = await fetcher<{ rate: SavingsRate }>('/api/director/savings/rate/current', {
      method: 'GET',
    });
    return response.rate;
  } catch (error) {
    console.error('Error fetching current savings rate:', error);
    return null;
  }
};

export const getSavingsRateHistory = async (): Promise<SavingsRate[]> => {
  try {
    const response = await fetcher<{ history: SavingsRate[] }>('/api/director/savings/rate/history', {
      method: 'GET',
    });
    return response.history || [];
  } catch (error) {
    console.error('Error fetching savings rate history:', error);
    return [];
  }
};

export const updateSavingsRate = async (payload: UpdateSavingsRatePayload): Promise<SavingsRate> => {
  try {
    const response = await fetcher<{ rate: SavingsRate }>('/api/director/savings/rate', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response.rate;
  } catch (error) {
    console.error('Error updating savings rate:', error);
    throw error;
  }
};
