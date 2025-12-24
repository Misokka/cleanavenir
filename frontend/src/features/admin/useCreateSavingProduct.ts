import { adminService } from "@/infrastructure/web/services/adminService";
import { useCallback, useState } from "react";

export type savingProductType = {
  id: string
  label: string,
  rate: number,
}

export type savingProductErrosType = {
  id: string, // not editable
  label: string,
  rate: string
}

export function useCreateSavingProduct(){
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSavingProduct = useCallback(async ({label, rate}: savingProductType) => {
    try{
      return await adminService.createSavingProduct({label, rate})
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSavingProduct = useCallback(async ({id, label, rate}: savingProductType) => {
   try{
      return await adminService.updateSavingProduct({id, label, rate})
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    setError,
    createSavingProduct,
    updateSavingProduct
  }
}