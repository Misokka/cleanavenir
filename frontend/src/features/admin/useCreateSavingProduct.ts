import { adminService } from "@/infrastructure/web/services/adminService";
import { useCallback, useState } from "react";

export async function useCreateSavingProduct(){
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSavingProduct = useCallback(async (label: string, rate: number) => {
    try{
      await adminService.createSavingProduct({label, rate})
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []) 

  return {
    isLoading,
    error,
    createSavingProduct
  }
}