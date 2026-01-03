import {stocksService, StockWithPriceHistory } from "@/infrastructure/web/services/stocksService";
import { useState } from "react";

export function useGetStockPriceHistory(){
  const [history, setHistory] = useState<StockWithPriceHistory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  async function getStockPriceHistory(stockId: string){
    try{
      const response = await stocksService.getStockPriceHistory(stockId);
      setHistory(response);
    } catch (error: any){
      setError(error)
    } finally {
      setLoading(false);
    }
  }

  return {
    history,
    getStockPriceHistory,
    loading,
    error
  }
}