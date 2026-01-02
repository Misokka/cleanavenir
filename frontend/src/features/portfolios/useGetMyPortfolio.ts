import { Portfolio, portfolioService } from "@/infrastructure/web/services/portfolioService";
import { useCallback, useEffect, useState } from "react";

export function useGetMyPortfolio(){
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyPortfolio = useCallback(async() => {
    try{
      const response = await portfolioService.getMyportfolio();
      setPortfolio(response.portfolio);
    } catch(error: any){
      setError(error)
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchMyPortfolio();
  }, [])

  return {
    portfolio,
    fetchMyPortfolio,
    loading,
    error
  }
}