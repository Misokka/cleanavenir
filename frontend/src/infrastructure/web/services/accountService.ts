import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  AccountDTO, 
  OperationDTO,
  NotFoundError,
  PaginationParams,
  PaginatedResponse 
} from '../types';

export class AccountService {
  async getAccounts(params?: PaginationParams): Promise<AccountDTO[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.order) queryParams.set('order', params.order);

      const endpoint = `${API_ENDPOINTS.ACCOUNTS.LIST}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await httpClient.get<AccountDTO[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes:', error);
      throw error;
    }
  }

  async getAccountDetails(accountId: string): Promise<AccountDTO> {
    if (!accountId) {
      throw new Error('ID de compte requis');
    }

    try {
      const response = await httpClient.get<AccountDTO>(
        API_ENDPOINTS.ACCOUNTS.DETAILS(accountId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(`Compte avec l'ID ${accountId} introuvable`, 'account');
      }
      throw error;
    }
  }

  async getAccountBalance(accountId: string): Promise<{ balance: number; currency: string }> {
    if (!accountId) {
      throw new Error('ID de compte requis');
    }

    try {
      const response = await httpClient.get<{ balance: number; currency: string }>(
        API_ENDPOINTS.ACCOUNTS.BALANCE(accountId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(`Solde du compte ${accountId} introuvable`, 'balance');
      }
      throw error;
    }
  }

  async createAccount(accountData: {
    name: string;
  }): Promise<AccountDTO> {
    try {
      const response = await httpClient.post<AccountDTO>(
        API_ENDPOINTS.ACCOUNTS.CREATE,
        { name: accountData.name }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      throw error;
    }
  }

  async renameAccount(
    accountId: string, 
    newName: string
  ): Promise<AccountDTO> {
    if (!accountId) {
      throw new Error('ID de compte requis');
    }

    try {
      const response = await httpClient.patch<AccountDTO>(
        API_ENDPOINTS.ACCOUNTS.UPDATE(accountId),
        { name: newName }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(`Compte avec l'ID ${accountId} introuvable`, 'account');
      }
      throw error;
    }
  }

  async deleteAccount(accountId: string): Promise<void> {
    if (!accountId) {
      throw new Error('ID de compte requis');
    }

    try {
      await httpClient.delete(API_ENDPOINTS.ACCOUNTS.DELETE(accountId));
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(`Compte avec l'ID ${accountId} introuvable`, 'account');
      }
      throw error;
    }
  }

  async getAccountsPaginated(params?: PaginationParams): Promise<PaginatedResponse<AccountDTO>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.order) queryParams.set('order', params.order);

      const endpoint = `${API_ENDPOINTS.ACCOUNTS.LIST}/paginated${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await httpClient.get<PaginatedResponse<AccountDTO>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération paginée des comptes:', error);
      throw error;
    }
  }

  async getAccountOperations(
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

  async downloadRib(accountId: string): Promise<Blob> {
    if (!accountId) {
      throw new Error('ID de compte requis');
    }

    try {
      // Récupère le RIB en PDF directement depuis l'API
      // On utilise fetch avec credentials: 'include' pour envoyer les cookies d'auth
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const endpoint = API_ENDPOINTS.ACCOUNTS.RIB(accountId);
      const fullUrl = `${apiUrl}${endpoint}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        credentials: 'include', // Important : envoie les cookies d'authentification
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        // Essayer de lire le message d'erreur du serveur
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Erreur serveur:', errorData);
          throw new Error(errorData.message || `Erreur ${response.status}`);
        }
        
        if (response.status === 404) {
          throw new NotFoundError(`RIB introuvable pour le compte ${accountId}`, 'rib');
        }
        if (response.status === 401) {
          throw new Error('Non authentifié - veuillez vous reconnecter');
        }
        throw new Error(`Erreur lors du téléchargement du RIB: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Erreur lors du téléchargement du RIB:', error);
      throw error;
    }
  }
}

export const accountService = new AccountService();