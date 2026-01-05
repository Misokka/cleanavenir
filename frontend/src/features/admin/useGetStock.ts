import { stocksService } from "@/infrastructure/web/services/stocksService";
import { Stock } from "@/infrastructure/web/services/stocksService";
import { useEffect, useState } from "react";

export function useGetStock(){
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  async function getStock(stockId: string){
    try{
      const response = await stocksService.getStockById(stockId);
      setStock(response);
      return response;
    } catch (error: any) {
      setError(error)
    } finally {
      setLoading(false);
    }
  }

  return {
    getStock,
    stock,
    loading,
    error
  }
}