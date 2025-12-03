import { httpClient } from '@/infrastructure/web/httpClient';

export interface DirectorStatistics {
  totalClients: number;
  totalAccounts: number;
  currentSavingsRate: number;
  availableStocks: number;
  totalTransactions?: number;
  totalSavingsAmount?: number;
}

export const getDirectorStatistics = async (): Promise<DirectorStatistics> => {
  try {
    const response = await httpClient.get<DirectorStatistics>('/director/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching director statistics:', error);
    return {
      totalClients: 0,
      totalAccounts: 0,
      currentSavingsRate: 0,
      availableStocks: 0,
    };
  }
};
