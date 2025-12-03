import { httpClient } from '@/infrastructure/web/httpClient';

export interface ClientAccount {
  id: string;
  accountNumber: string;
  clientId: string;
  clientName: string;
  type: string;
  balance: number;
  currency: string;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BanAccountPayload {
  reason?: string;
}

export interface RenameAccountPayload {
  accountName: string;
}

export interface CreateAccountPayload {
  clientId: string;
  type: string;
  currency?: string;
  initialBalance?: number;
}

/**
 * Récupère tous les comptes clients
 */
export const getAllClientAccounts = async (): Promise<ClientAccount[]> => {
  try {
    const response = await httpClient.get<{ accounts: ClientAccount[] }>('/director/accounts');
    return response.data.accounts || [];
  } catch (error) {
    console.error('Error fetching client accounts:', error);
    return [];
  }
};

/**
 * Récupère un compte client par ID
 */
export const getClientAccountById = async (accountId: string): Promise<ClientAccount | null> => {
  try {
    const response = await httpClient.get<{ account: ClientAccount }>(`/director/accounts/${accountId}`);
    return response.data.account;
  } catch (error) {
    console.error(`Error fetching account ${accountId}:`, error);
    return null;
  }
};

/**
 * Bannir un compte client
 */
export const banClientAccount = async (accountId: string, payload: BanAccountPayload): Promise<ClientAccount> => {
  try {
    const response = await httpClient.post<{ account: ClientAccount }>(`/director/accounts/${accountId}/ban`, payload);
    return response.data.account;
  } catch (error) {
    console.error(`Error banning account ${accountId}:`, error);
    throw error;
  }
};

/**
 * Débannir un compte client
 */
export const unbanClientAccount = async (accountId: string): Promise<ClientAccount> => {
  try {
    const response = await httpClient.post<{ account: ClientAccount }>(`/director/accounts/${accountId}/unban`, {});
    return response.data.account;
  } catch (error) {
    console.error(`Error unbanning account ${accountId}:`, error);
    throw error;
  }
};

/**
 * Renommer un compte client
 */
export const renameClientAccount = async (accountId: string, payload: RenameAccountPayload): Promise<ClientAccount> => {
  try {
    const response = await httpClient.put<{ account: ClientAccount }>(`/director/accounts/${accountId}/rename`, payload);
    return response.data.account;
  } catch (error) {
    console.error(`Error renaming account ${accountId}:`, error);
    throw error;
  }
};

/**
 * Supprimer un compte client
 */
export const deleteClientAccount = async (accountId: string): Promise<boolean> => {
  try {
    await httpClient.delete(`/director/accounts/${accountId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting account ${accountId}:`, error);
    throw error;
  }
};

/**
 * Créer un nouveau compte client
 */
export const createClientAccount = async (payload: CreateAccountPayload): Promise<ClientAccount> => {
  try {
    const response = await httpClient.post<{ account: ClientAccount }>('/director/accounts', payload);
    return response.data.account;
  } catch (error) {
    console.error('Error creating client account:', error);
    throw error;
  }
};
