import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  OperationDTO, 
  NotFoundError,
  PaginationParams,
  PaginatedResponse 
} from '../types';

export interface OperationFilters {
  type?: string[]; // ['CREDIT', 'DEBIT', 'TRANSFER', 'INTEREST']
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  amountMin?: number; // en euros
  amountMax?: number; // en euros
  accountId?: string;
}

export interface OperationWithDirection {
  id: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
  direction: 'INCOMING' | 'OUTGOING' | 'INTERNAL';
  userAccountId: string;
}

export class OperationService {
  async getOperationsHistory(filters?: OperationFilters): Promise<OperationWithDirection[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.type && filters.type.length > 0) {
        for (const t of filters.type) {
          queryParams.append('type', t);
        }
      }
      if (filters?.dateFrom) {
        queryParams.set('dateFrom', filters.dateFrom);
      }
      if (filters?.dateTo) {
        queryParams.set('dateTo', filters.dateTo);
      }
      if (filters?.amountMin !== undefined) {
        queryParams.set('amountMin', filters.amountMin.toString());
      }
      if (filters?.amountMax !== undefined) {
        queryParams.set('amountMax', filters.amountMax.toString());
      }
      if (filters?.accountId) {
        queryParams.set('accountId', filters.accountId);
      }

      const endpoint = `${API_ENDPOINTS.OPERATIONS.HISTORY}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await httpClient.get<OperationWithDirection[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }

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

  async transfer(payload: {
    fromAccountId: string;
    toAccountId?: string;
    toIban?: string;
    amount: number;
    description?: string;
  }): Promise<{ success: boolean; message?: string }> {
    if (!payload.fromAccountId) {
      throw new Error('Le compte source est requis');
    }

    if (!payload.toAccountId && !payload.toIban) {
      throw new Error('Le compte destinataire ou l\'IBAN est requis');
    }

    if (payload.toAccountId && payload.toIban) {
      throw new Error('Fournir soit un compte destinataire, soit un IBAN, pas les deux');
    }

    if (payload.amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    if (payload.toAccountId && payload.fromAccountId === payload.toAccountId) {
      throw new Error('Les comptes source et destination doivent être différents');
    }

    try {
      const response = await httpClient.post<{ success: boolean; message?: string }>(
        API_ENDPOINTS.OPERATIONS.TRANSFER,
        payload
      );
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors du virement:', error);
      throw error;
    }
  }
}

export const operationService = new OperationService();