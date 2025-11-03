import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  OperationDTO, 
  NotFoundError,
  PaginationParams,
  PaginatedResponse 
} from '../types';

export class OperationService {
  async getRecentOperations(limit: number = 5): Promise<OperationDTO[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('limit', limit.toString());

      const endpoint = `${API_ENDPOINTS.OPERATIONS.RECENT}?${queryParams.toString()}`;
      const response = await httpClient.get<OperationDTO[]>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des opérations récentes:', error);
      throw error;
    }
  }

  async getAllOperations(params?: PaginationParams): Promise<OperationDTO[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.order) queryParams.set('order', params.order);

      const endpoint = `${API_ENDPOINTS.OPERATIONS.LIST}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await httpClient.get<OperationDTO[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des opérations:', error);
      throw error;
    }
  }

  async getOperationsByAccount(
    accountId: string, 
    params?: PaginationParams
  ): Promise<OperationDTO[]> {
    if (!accountId) {
      throw new Error('ID de compte requis');
    }

    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.order) queryParams.set('order', params.order);

      const endpoint = `${API_ENDPOINTS.OPERATIONS.BY_ACCOUNT(accountId)}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await httpClient.get<OperationDTO[]>(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(
          `Opérations du compte ${accountId} introuvables`, 
          'operations'
        );
      }
      throw error;
    }
  }

  async getOperationDetails(operationId: string): Promise<OperationDTO> {
    if (!operationId) {
      throw new Error('ID d\'opération requis');
    }

    try {
      const response = await httpClient.get<OperationDTO>(
        API_ENDPOINTS.OPERATIONS.DETAILS(operationId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(
          `Opération avec l'ID ${operationId} introuvable`, 
          'operation'
        );
      }
      throw error;
    }
  }

  async createOperation(operationData: {
    AccountId: string;
    kind: 'CREDIT' | 'DEBIT';
    amount: number;
    currency?: string;
    label: string;
  }): Promise<OperationDTO> {
    try {
      const response = await httpClient.post<OperationDTO>(
        API_ENDPOINTS.OPERATIONS.CREATE,
        {
          ...operationData,
          currency: operationData.currency || 'EUR'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'opération:', error);
      throw error;
    }
  }

  async getOperationsPaginated(params?: PaginationParams): Promise<PaginatedResponse<OperationDTO>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.order) queryParams.set('order', params.order);
      
      // Ajouter la pagination dans l'endpoint
      queryParams.set('paginated', 'true');

      const endpoint = `${API_ENDPOINTS.OPERATIONS.LIST}?${queryParams.toString()}`;
      const response = await httpClient.get<PaginatedResponse<OperationDTO>>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération paginée des opérations:', error);
      throw error;
    }
  }

  async getOperationsByType(
    type: 'CREDIT' | 'DEBIT',
    params?: PaginationParams
  ): Promise<OperationDTO[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('kind', type);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.order) queryParams.set('order', params.order);

      const endpoint = `${API_ENDPOINTS.OPERATIONS.LIST}?${queryParams.toString()}`;
      const response = await httpClient.get<OperationDTO[]>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des opérations ${type}:`, error);
      throw error;
    }
  }

  async searchOperations(
    query: string,
    params?: PaginationParams
  ): Promise<OperationDTO[]> {
    if (!query.trim()) {
      throw new Error('Terme de recherche requis');
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.set('search', query);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.order) queryParams.set('order', params.order);

      const endpoint = `${API_ENDPOINTS.OPERATIONS.LIST}?${queryParams.toString()}`;
      const response = await httpClient.get<OperationDTO[]>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'opérations:', error);
      throw error;
    }
  }
}

export const operationService = new OperationService();