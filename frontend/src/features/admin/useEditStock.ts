import { stocksService, UpdateStockPayload } from "@/infrastructure/web/services/stocksService";
import { useState } from "react";

export function useEditStock(){
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  async function editStock(stockId: string, data: UpdateStockPayload){
    try{
      const response = await stocksService.updateStock(stockId, data);
      setSuccess(response.success);
      return response;
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    editStock,
    success,
    loading,
    error
  }
}