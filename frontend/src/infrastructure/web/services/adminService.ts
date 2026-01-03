import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { UserDTO } from '../types';
import { SavingProductDTO } from './savingService';
import { Stock } from './stocksService';

export interface ClientDTO {
  id: string;
  userId: string;
  user: UserDTO;
}

export interface StatisticsDTO {
  totalClients: number;
  totalAccounts: number;
  totalOperations: number;
  activeLoans: number;
  totalLoanAmount: number;
}

export interface CreateSavingProductRequest {
  label: string;
  rate: number;
}

export interface EditSavingProductRequest {
  id: string;
  label: string;
  rate: number;
}

export interface EditStockRequest {
  isAvailable: boolean;
  ticker: string;
}

export interface EditStockResponse {
  success: boolean,
  message: string
}

export class AdminService {
  async getClients(): Promise<ClientDTO[]> {
    try {
      const response = await httpClient.get<{ clients: ClientDTO[] }>(
        API_ENDPOINTS.ADMIN.CLIENTS
      );
      return response.data.clients;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  }

  async banClient(clientId: string): Promise<ClientDTO> {
    try {
      const response = await httpClient.post<{ client: ClientDTO }>(
        API_ENDPOINTS.ADMIN.BAN_CLIENT(clientId)
      );
      return response.data.client;
    } catch (error) {
      console.error('Erreur lors du bannissement du client:', error);
      throw error;
    }
  }

  async unbanClient(clientId: string): Promise<ClientDTO> {
    try {
      const response = await httpClient.post<{ client: ClientDTO }>(
        API_ENDPOINTS.ADMIN.UNBAN_CLIENT(clientId)
      );
      return response.data.client;
    } catch (error) {
      console.error('Erreur lors de la réintégration du client:', error);
      throw error;
    }
  }

  async getStatistics(): Promise<StatisticsDTO> {
    try {
      const response = await httpClient.get<{ statistics: StatisticsDTO }>(
        API_ENDPOINTS.ADMIN.STATISTICS
      );
      return response.data.statistics;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  async setSavingRate(rate: number): Promise<{ rate: number }> {
    try {
      const response = await httpClient.post<{ rate: number }>(
        API_ENDPOINTS.ADMIN.SET_SAVING_RATE,
        { rate }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du taux d\'épargne:', error);
      throw error;
    }
  }

  async createSavingProduct(data: CreateSavingProductRequest): Promise<SavingProductDTO>{
    try{
      const response = await httpClient.post<SavingProductDTO>(
        API_ENDPOINTS.ADMIN.SAVINGS.PRODUCTS.CREATE,
        data
      )
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du produit d'épargne", error);
      throw error
    }
  }

  async getSavingProducts(): Promise<SavingProductDTO[]> {
    try{
      const response = await httpClient.get<SavingProductDTO[]>(
        API_ENDPOINTS.ADMIN.SAVINGS.PRODUCTS.LIST
      )
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des produits d'épargne", error);
      throw error
    }
  }

  async updateSavingProduct(data: EditSavingProductRequest): Promise<SavingProductDTO>{
    try{
      const response = await httpClient.put<SavingProductDTO>(
        API_ENDPOINTS.ADMIN.SAVINGS.PRODUCTS.UPDATE(data.id),
        data
      )
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification du produit d'épargne", error);
      throw error
    }
  }

  async getStock(stockId: string){
    try{
      const response = await httpClient.get<{stock: Stock}>(API_ENDPOINTS.INVESTMENTS.STOCKS.DETAILS(stockId));
      return response.data.stock
    } catch (error) {
      console.error("Erreur lors de la récupération de l'action", error);
      throw error
    }
  }

  async editStock(stockId: string, data: EditStockRequest): Promise<EditStockResponse>{
    try{
      const response = await httpClient.put<EditStockResponse>(
        API_ENDPOINTS.ADMIN.STOCKS.EDIT_STOCK(stockId), data
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modifiction de l'action", error);
      throw error
    }
  }

  
}

export const adminService = new AdminService();
