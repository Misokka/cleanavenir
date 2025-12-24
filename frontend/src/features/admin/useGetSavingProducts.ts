import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/infrastructure/web/services/adminService";
import { SavingProductDTO } from "@/infrastructure/web/services/savingService";
import { get } from "http";

export function useGetSavingProducts(){
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [savingProducts, setSavingProducts] = useState<SavingProductDTO[]>([]);

  const getSavingProducts = useCallback(async () => {
    try{
      const products = await adminService.getSavingProducts();
      setSavingProducts(products);
      return products;
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getSavingProducts();
  }, [getSavingProducts]);

  return {
    getSavingProducts,
    savingProducts,
    isLoading,
    error,
    setError
  };
}