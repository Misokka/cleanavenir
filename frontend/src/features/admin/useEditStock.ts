import { adminService, EditStockRequest } from "@/infrastructure/web/services/adminService";
import { useState } from "react";

export function useEditStock(){
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  async function editStock(stockId: string, data: EditStockRequest){
    try{
      const response = await adminService.editStock(stockId, data);
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