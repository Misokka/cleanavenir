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

// Types pour les réponses backend
interface BackendClient {
  id: string;
  userId: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    isActive: boolean;
    emailVerifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}


const mapClientToAccount = (client: BackendClient): ClientAccount => ({
  id: client.userId, 
  accountNumber: client.user.email,
  clientId: client.id,
  clientName: `${client.user.firstname} ${client.user.lastname}`,
  type: 'CLIENT',
  balance: 0, 
  currency: 'EUR',
  isActive: client.user.isActive,
  isBanned: !client.user.isActive,
  createdAt: client.user.createdAt,
  updatedAt: client.user.updatedAt,
});

export const getAllClientAccounts = async (): Promise<ClientAccount[]> => {
  try {
    const response = await httpClient.get<{ clients: BackendClient[] }>('/admin/clients');
    const clients = response.data.clients || [];
    return clients.map(mapClientToAccount);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

export const getClientAccountById = async (accountId: string): Promise<ClientAccount | null> => {
  try {
    const accounts = await getAllClientAccounts();
    return accounts.find(acc => acc.id === accountId) || null;
  } catch (error) {
    console.error(`Error fetching client ${accountId}:`, error);
    return null;
  }
};

export const banClientAccount = async (userId: string, payload: BanAccountPayload): Promise<ClientAccount> => {
  try {
    const response = await httpClient.post<{ message: string; client: { id: string; email: string; isActive: boolean } }>(
      `/admin/clients/${userId}/ban`,
      payload
    );
    
    return {
      id: response.data.client.id,
      accountNumber: response.data.client.email,
      clientId: userId,
      clientName: response.data.client.email,
      type: 'CLIENT',
      balance: 0,
      currency: 'EUR',
      isActive: response.data.client.isActive,
      isBanned: !response.data.client.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error banning client ${userId}:`, error);
    throw error;
  }
};

export const unbanClientAccount = async (userId: string): Promise<ClientAccount> => {
  try {
    const response = await httpClient.post<{ message: string; client: { id: string; email: string; isActive: boolean } }>(
      `/admin/clients/${userId}/unban`,
      {}
    );
    
    return {
      id: response.data.client.id,
      accountNumber: response.data.client.email,
      clientId: userId,
      clientName: response.data.client.email,
      type: 'CLIENT',
      balance: 0,
      currency: 'EUR',
      isActive: response.data.client.isActive,
      isBanned: !response.data.client.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error unbanning client ${userId}:`, error);
    throw error;
  }
};

export const renameClientAccount = async (accountId: string, payload: RenameAccountPayload): Promise<ClientAccount> => {
  try {
    const response = await httpClient.put<{ message: string; account: any }>(
      `/admin/accounts/${accountId}/rename`,
      { newName: payload.accountName }
    );
    
    const backendAccount = response.data.account;
    return {
      id: backendAccount.id,
      accountNumber: backendAccount.iban || backendAccount.id,
      clientId: backendAccount.clientId || backendAccount.ownerId,
      clientName: '',
      type: 'BANK_ACCOUNT',
      balance: backendAccount.balance / 100, 
      currency: backendAccount.currency || 'EUR',
      isActive: true,
      isBanned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error renaming account ${accountId}:`, error);
    throw error;
  }
};

export const deleteClientAccount = async (accountId: string): Promise<boolean> => {
  try {
    await httpClient.delete(`/admin/accounts/${accountId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting account ${accountId}:`, error);
    throw error;
  }
};

export const createClientAccount = async (payload: CreateAccountPayload): Promise<ClientAccount> => {
  try {
    const response = await httpClient.post<{ message: string; account: any }>(
      `/admin/clients/${payload.clientId}/accounts`,
      { name: payload.type } 
    );
    
    const backendAccount = response.data.account;
    return {
      id: backendAccount.id,
      accountNumber: backendAccount.iban || backendAccount.id,
      clientId: payload.clientId,
      clientName: '',
      type: 'BANK_ACCOUNT',
      balance: backendAccount.balance / 100, 
      currency: backendAccount.currency || 'EUR',
      isActive: true,
      isBanned: false,
      createdAt: backendAccount.createdAt || new Date().toISOString(),
      updatedAt: backendAccount.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating client account:', error);
    throw error;
  }
};
