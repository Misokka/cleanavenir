import { useState, useEffect, useCallback } from 'react';
import { operationService } from '@/infrastructure/web/services/operationService';
import { 
  OperationDTO, 
  AsyncState,
  PaginationParams,
  NotFoundError 
} from '@/infrastructure/web/types';

export function useGetRecentOperations(limit: number = 5) {
  const [state, setState] = useState<AsyncState<OperationDTO[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRecentOperations = useCallback(async (fetchLimit: number) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const operations = await operationService.getRecentOperations(fetchLimit);
      
      setState({
        data: operations,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des opérations récentes';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    fetchRecentOperations(limit);
  }, [fetchRecentOperations, limit]);

  const refetch = useCallback(() => {
    fetchRecentOperations(limit);
  }, [fetchRecentOperations, limit]);

  return {
    operations: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useGetAllOperations(params?: PaginationParams) {
  const [state, setState] = useState<AsyncState<OperationDTO[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchOperations = useCallback(async (fetchParams?: PaginationParams) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const operations = await operationService.getAllOperations(fetchParams);
      
      setState({
        data: operations,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des opérations';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    fetchOperations(params);
  }, [fetchOperations, params?.page, params?.limit, params?.sort, params?.order]);

  const refetch = useCallback(() => {
    fetchOperations(params);
  }, [fetchOperations, params]);

  return {
    operations: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useGetOperationsByAccount(
  accountId: string | null, 
  params?: PaginationParams
) {
  const [state, setState] = useState<AsyncState<OperationDTO[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchOperationsByAccount = useCallback(async (
    id: string, 
    fetchParams?: PaginationParams
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const operations = await operationService.getOperationsByAccount(id, fetchParams);
      
      setState({
        data: operations,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des opérations du compte';
      
      if (error instanceof NotFoundError) {
        errorMessage = 'Opérations du compte introuvables';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchOperationsByAccount(accountId, params);
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, [accountId, fetchOperationsByAccount, params?.page, params?.limit, params?.sort, params?.order]);

  const refetch = useCallback(() => {
    if (accountId) {
      fetchOperationsByAccount(accountId, params);
    }
  }, [accountId, fetchOperationsByAccount, params]);

  return {
    operations: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useGetOperationDetails(operationId: string | null) {
  const [state, setState] = useState<AsyncState<OperationDTO>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchOperationDetails = useCallback(async (id: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const operation = await operationService.getOperationDetails(id);
      
      setState({
        data: operation,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la récupération des détails de l\'opération';
      
      if (error instanceof NotFoundError) {
        errorMessage = 'Opération introuvable';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    if (operationId) {
      fetchOperationDetails(operationId);
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, [operationId, fetchOperationDetails]);

  const refetch = useCallback(() => {
    if (operationId) {
      fetchOperationDetails(operationId);
    }
  }, [operationId, fetchOperationDetails]);

  return {
    operation: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useGetOperationsByType(
  type: 'CREDIT' | 'DEBIT' | null, 
  params?: PaginationParams
) {
  const [state, setState] = useState<AsyncState<OperationDTO[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchOperationsByType = useCallback(async (
    operationType: 'CREDIT' | 'DEBIT',
    fetchParams?: PaginationParams
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const operations = await operationService.getOperationsByType(operationType, fetchParams);
      
      setState({
        data: operations,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = `Erreur lors de la récupération des opérations ${operationType}`;
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    if (type) {
      fetchOperationsByType(type, params);
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, [type, fetchOperationsByType, params?.page, params?.limit, params?.sort, params?.order]);

  const refetch = useCallback(() => {
    if (type) {
      fetchOperationsByType(type, params);
    }
  }, [type, fetchOperationsByType, params]);

  return {
    operations: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
  };
}

export function useSearchOperations() {
  const [state, setState] = useState<AsyncState<OperationDTO[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const searchOperations = useCallback(async (
    query: string,
    params?: PaginationParams
  ) => {
    if (!query.trim()) {
      setState({
        data: [],
        loading: false,
        error: null,
      });
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const operations = await operationService.searchOperations(query, params);
      
      setState({
        data: operations,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erreur lors de la recherche d\'opérations';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    operations: state.data,
    loading: state.loading,
    error: state.error,
    searchOperations,
    clearSearch,
  };
}