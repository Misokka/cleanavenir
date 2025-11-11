import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  SavingAccountDTO, 
  SavingRateDTO, 
  AccountDTO,
  NotFoundError 
} from '../types';

export interface SavingDTO {
  id: string;
  accountId: string;
  balance: number; // en euros
  rate: number; // en pourcentage (ex: 2.5)
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingRequest {
  sourceAccountId: string;
  initialAmount: number; // en euros
  rate?: number; // optionnel, défaut 2.5%
}

export interface CurrentRateDTO {
  rate: number;
  updatedAt: string;
}

export class SavingService {
  async getSavings(): Promise<SavingDTO[]> {
    try {
      const response = await httpClient.get<SavingDTO[]>(API_ENDPOINTS.SAVINGS.LIST);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des épargnes:', error);
      throw error;
    }
  }

  async getSavingById(id: string): Promise<SavingDTO> {
    try {
      const response = await httpClient.get<SavingDTO>(`${API_ENDPOINTS.SAVINGS.LIST}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'épargne:', error);
      throw error;
    }
  }

  async createSaving(data: CreateSavingRequest): Promise<SavingDTO> {
    try {
      const response = await httpClient.post<SavingDTO>(
        API_ENDPOINTS.SAVINGS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'épargne:', error);
      throw error;
    }
  }

  async getCurrentRate(): Promise<CurrentRateDTO> {
    try {
      const response = await httpClient.get<CurrentRateDTO>(
        API_ENDPOINTS.SAVINGS.CURRENT_RATE
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du taux actuel:', error);
      throw error;
    }
  }

  async applyDailyInterest(): Promise<{ message: string; processed: number; totalInterest: number }> {
    try {
      const response = await httpClient.post<{ message: string; processed: number; totalInterest: number }>(
        API_ENDPOINTS.SAVINGS.APPLY_INTEREST,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'application des intérêts:', error);
      throw error;
    }
  }

  async getSavingAccounts(): Promise<SavingAccountDTO[]> {
    try {
      const response = await httpClient.get<SavingAccountDTO[]>(
        API_ENDPOINTS.SAVINGS.ACCOUNTS
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes d\'épargne:', error);
      throw error;
    }
  }

  async getSavingAccountDetails(savingAccountId: string): Promise<SavingAccountDTO> {
    if (!savingAccountId) {
      throw new Error('ID de compte d\'épargne requis');
    }

    try {
      const response = await httpClient.get<SavingAccountDTO>(
        API_ENDPOINTS.SAVINGS.ACCOUNT_DETAILS(savingAccountId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(
          `Compte d'épargne avec l'ID ${savingAccountId} introuvable`, 
          'savingAccount'
        );
      }
      throw error;
    }
  }

  async getCurrentSavingRates(): Promise<SavingRateDTO[]> {
    try {
      const response = await httpClient.get<SavingRateDTO[]>(
        API_ENDPOINTS.SAVINGS.RATES
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des taux d\'épargne:', error);
      throw error;
    }
  }

  async getCurrentSavingRate(): Promise<SavingRateDTO> {
    try {
      const response = await httpClient.get<SavingRateDTO>(
        API_ENDPOINTS.SAVINGS.CURRENT_RATE
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du taux d\'épargne actuel:', error);
      throw error;
    }
  }

  async createSavingAccount(data: {
    AccountId: string;
  }): Promise<SavingAccountDTO> {
    if (!data.AccountId) {
      throw new Error('ID de compte bancaire requis pour créer un compte d\'épargne');
    }

    try {
      const response = await httpClient.post<SavingAccountDTO>(
        API_ENDPOINTS.SAVINGS.CREATE_ACCOUNT,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('AlreadyHasSavingAccount')) {
          throw new Error('Ce compte possède déjà un produit d\'épargne');
        }
        if (error.message.includes('AccountNotFound')) {
          throw new NotFoundError('Compte bancaire introuvable', 'account');
        }
      }
      console.error('Erreur lors de la création du compte d\'épargne:', error);
      throw error;
    }
  }

  async getAccountsWithSavings(): Promise<Array<AccountDTO & { savingAccount?: SavingAccountDTO }>> {
    try {
      const response = await httpClient.get<Array<AccountDTO & { savingAccount?: SavingAccountDTO }>>(
        `${API_ENDPOINTS.SAVINGS.ACCOUNTS}/with-accounts`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes avec épargne:', error);
      throw error;
    }
  }

  async toggleSavingAccountStatus(
    savingAccountId: string, 
    isActive: boolean
  ): Promise<SavingAccountDTO> {
    if (!savingAccountId) {
      throw new Error('ID de compte d\'épargne requis');
    }

    try {
      const response = await httpClient.put<SavingAccountDTO>(
        API_ENDPOINTS.SAVINGS.ACCOUNT_DETAILS(savingAccountId),
        { isActive }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(
          `Compte d'épargne avec l'ID ${savingAccountId} introuvable`, 
          'savingAccount'
        );
      }
      throw error;
    }
  }

  async calculateSavingInterests(
    savingAccountId: string,
    period: 'monthly' | 'yearly' = 'yearly'
  ): Promise<{
    principal: number;
    interestRate: number;
    calculatedInterest: number;
    period: string;
  }> {
    if (!savingAccountId) {
      throw new Error('ID de compte d\'épargne requis');
    }

    try {
      const response = await httpClient.get<{
        principal: number;
        interestRate: number;
        calculatedInterest: number;
        period: string;
      }>(
        `${API_ENDPOINTS.SAVINGS.ACCOUNT_DETAILS(savingAccountId)}/interests?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors du calcul des intérêts:', error);
      throw error;
    }
  }

  async getSavingRatesHistory(limit?: number): Promise<SavingRateDTO[]> {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.set('limit', limit.toString());

      const endpoint = `${API_ENDPOINTS.SAVINGS.RATES}/history${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await httpClient.get<SavingRateDTO[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des taux:', error);
      throw error;
    }
  }
}

export const savingService = new SavingService();