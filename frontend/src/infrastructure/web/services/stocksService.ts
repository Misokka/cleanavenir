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
}

export const stocksService = new StockService();