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
    const response = await httpClient.get<{ rate: SavingsRate }>('/director/savings/rate/current');
    return response.data.rate;
  } catch (error) {
    console.error('Error fetching current savings rate:', error);
    return null;
  }
};

export const getSavingsRateHistory = async (): Promise<SavingsRate[]> => {
  try {
    const response = await httpClient.get<{ history: SavingsRate[] }>('/director/savings/rate/history');
    return response.data.history || [];
  } catch (error) {
    console.error('Error fetching savings rate history:', error);
    return [];
  }
};

export const updateSavingsRate = async (payload: UpdateSavingsRatePayload): Promise<SavingsRate> => {
  try {
    const response = await httpClient.put<{ rate: SavingsRate }>('/director/savings/rate', payload);
    return response.data.rate;
  } catch (error) {
    console.error('Error updating savings rate:', error);
    throw error;
  }
};
