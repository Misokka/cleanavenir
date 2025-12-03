import { httpClient } from '@/infrastructure/web/httpClient';

export interface Stock {
  id: string;
  companyId: string;
  companyName: string;
  ticker: string;
  isAvailable: boolean;
  currentPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockPayload {
  companyId: string;
  ticker: string;
  isAvailable?: boolean;
}

export interface UpdateStockPayload {
  companyId?: string;
  ticker?: string;
  isAvailable?: boolean;
}

export const getAllStocks = async (): Promise<Stock[]> => {
  try {
    const response = await httpClient.get<{ stocks: Stock[] }>('/director/stocks');
    return response.data.stocks || [];
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
};

export const getStockById = async (stockId: string): Promise<Stock | null> => {
  try {
    const response = await httpClient.get<{ stock: Stock }>(`/director/stocks/${stockId}`);
    return response.data.stock;
  } catch (error) {
    console.error(`Error fetching stock ${stockId}:`, error);
    return null;
  }
};

export const createStock = async (payload: CreateStockPayload): Promise<Stock> => {
  try {
    const response = await httpClient.post<{ stock: Stock }>('/director/stocks', payload);
    return response.data.stock;
  } catch (error) {
    console.error('Error creating stock:', error);
    throw error;
  }
};

export const updateStock = async (stockId: string, payload: UpdateStockPayload): Promise<Stock> => {
  try {
    const response = await httpClient.put<{ stock: Stock }>(`/director/stocks/${stockId}`, payload);
    return response.data.stock;
  } catch (error) {
    console.error(`Error updating stock ${stockId}:`, error);
    throw error;
  }
};

export const toggleStockAvailability = async (stockId: string, isAvailable: boolean): Promise<Stock> => {
  try {
    const response = await httpClient.patch<{ stock: Stock }>(`/director/stocks/${stockId}/availability`, { isAvailable });
    return response.data.stock;
  } catch (error) {
    console.error(`Error toggling stock ${stockId} availability:`, error);
    throw error;
  }
};

export const deleteStock = async (stockId: string): Promise<boolean> => {
  try {
    await httpClient.delete(`/director/stocks/${stockId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting stock ${stockId}:`, error);
    throw error;
  }
};
