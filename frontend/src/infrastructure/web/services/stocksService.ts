import { API_ENDPOINTS } from "../endpoints";
import { httpClient } from "../httpClient";
import { Company } from "./companiesService";

export type Stock = {
  id: string;
  companyId: string;
  ticker: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  company: Company;
}

export type StockWithPriceHistory = {
  stock: Stock
  stockPriceHistory: StockPriceHistory[]
}

export type StockPriceHistory = {
  id: string,
  price: number,
  recordedAt: string
}

export type CreateStockPayload = {
  companyId: string;
  ticker: string;
  price: number;
  isAvailable: boolean;
  initialQuantity: number;
}

export type UpdateStockPayload = {
  ticker?: string;
  price?: number;
  isAvailable?: boolean;
}

class StockService {
  async listStocks(){
    try{
      const response = await httpClient.get<{stocks: Stock[]}>(
        API_ENDPOINTS.INVESTMENTS.STOCKS.LIST
      );

      return response.data.stocks;
    } catch (error){
      console.log("An error occured when listing stocks", error);
      throw error;
    }
  }

  async getStockById(stockId: string): Promise<Stock> {
    try {
      const response = await httpClient.get<{ stock: Stock }>(
        API_ENDPOINTS.INVESTMENTS.STOCKS.GET_STOCK(stockId)
      );
      return response.data.stock;
    } catch (error) {
      console.error("Error getting stock:", error);
      throw error;
    }
  }

  async getStockPriceHistory(stockId: string){
    try{
      const response = await httpClient.get<{stockPriceHistory: StockWithPriceHistory}>(
        API_ENDPOINTS.INVESTMENTS.STOCKS.GET_STOCK_PRICE_HISTORY(stockId)
      );
      return response.data.stockPriceHistory
    } catch (error) {
      console.log("An error occured when listing stock price history", error);
      throw error;
    }
  }

  async createStock(payload: CreateStockPayload): Promise<Stock> {
    try {
      const response = await httpClient.post<{ stock: Stock }>(
        API_ENDPOINTS.INVESTMENTS.STOCKS.CREATE,
        payload
      );
      return response.data.stock;
    } catch (error) {
      console.error("Error creating stock:", error);
      throw error;
    }
  }

  async updateStock(stockId: string, payload: UpdateStockPayload): Promise<{ success: boolean }> {
    try {
      const response = await httpClient.put<{ success: boolean }>(
        API_ENDPOINTS.INVESTMENTS.STOCKS.UPDATE(stockId),
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }

  async deleteStock(stockId: string): Promise<void> {
    try {
      await httpClient.delete(
        API_ENDPOINTS.INVESTMENTS.STOCKS.DELETE(stockId)
      );
    } catch (error) {
      console.error("Error deleting stock:", error);
      throw error;
    }
  }
}

export const stocksService = new StockService();