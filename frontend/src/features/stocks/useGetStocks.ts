import { Stock, stocksService } from "@/infrastructure/web/services/stocksService";
import { useCallback, useEffect, useState } from "react";

export function useGetStocks(){
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try{
      setLoading(true);
      const response = await stocksService.listStocks();
      setStocks(response);
    } catch (err: any){
      setError(err.message || "An error occured while fetching stocks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return {
    stocks,
    fetchStocks,
    loading,
    error
  }
}