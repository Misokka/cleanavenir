import { portfolioService } from "@/infrastructure/web/services/portfolioService";
import { useCallback, useState } from "react";

export function useCreatePortfolio(){
  const [success, setSuccess] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
    const createPortfolio = useCallback(async() => {
      try{
        const response = await portfolioService.createPortfolio();
        setSuccess(response.sucess);
      } catch(error: any){
        setError(error)
      } finally {
        setLoading(false);
      }
    }, []);
  
    return {
      createPortfolio,
      loading,
      success,
      error
    }
}