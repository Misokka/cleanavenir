import { companiesService, Company } from "@/infrastructure/web/services/companiesService";
import { useCallback, useEffect, useState } from "react";

export function useGetCompanies(){
  const [companies, setCompanies] = useState<Company[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanies = useCallback(async () => {
    try{
      const fetchedCompanies = await companiesService.listCompanies();
      setCompanies(fetchedCompanies);
      setFetchLoading(false);
    } catch (e: any) {
      setError(e);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    fetchCompanies,
    fetchLoading,
    error,
    setError
  }
}