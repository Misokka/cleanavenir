import { httpClient } from '@/infrastructure/web/httpClient';

export interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateClientPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UpdateClientPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export const listClients = async (): Promise<Client[]> => {
  try {
    const response = await httpClient.get<{ clients: any[] }>('/admin/clients');
    const clients = response.data.clients || [];
    
    return clients.map((client) => ({
      id: client.userId,
      email: client.user.email,
      firstName: client.user.firstname,
      lastName: client.user.lastname,
      role: client.user.role,
      isActive: client.user.isActive,
      createdAt: client.user.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

export const createClient = async (payload: CreateClientPayload): Promise<Client> => {
  const response = await httpClient.post<{ message: string; client: any }>('/admin/clients', payload);
  const { client } = response.data;
  
  return {
    id: client.id,
    email: client.email,
    firstName: client.firstName,
    lastName: client.lastName,
    role: client.role,
    isActive: client.isActive,
    createdAt: client.createdAt,
  };
};

export const updateClient = async (userId: string, payload: UpdateClientPayload): Promise<Client> => {
  const response = await httpClient.put<{ message: string; client: any }>(`/admin/clients/${userId}`, payload);
  const { client } = response.data;
  
  return {
    id: client.id,
    email: client.email,
    firstName: client.firstName,
    lastName: client.lastName,
    role: client.role,
    isActive: client.isActive,
    createdAt: client.createdAt,
  };
};

export const deleteClient = async (userId: string): Promise<boolean> => {
  await httpClient.delete(`/admin/clients/${userId}`);
  return true;
};

export const banClient = async (userId: string, reason?: string): Promise<Client> => {
  const response = await httpClient.post<{ message: string; client: any }>(
    `/admin/clients/${userId}/ban`,
    { reason }
  );
  
  const { client } = response.data;
  return {
    id: client.id,
    email: client.email,
    firstName: client.email,
    lastName: '',
    role: 'CLIENT',
    isActive: client.isActive,
    createdAt: new Date().toISOString(),
  };
};

export const unbanClient = async (userId: string): Promise<Client> => {
  const response = await httpClient.post<{ message: string; client: any }>(
    `/admin/clients/${userId}/unban`,
    {}
  );
  
  const { client } = response.data;
  return {
    id: client.id,
    email: client.email,
    firstName: client.email,
    lastName: '',
    role: 'CLIENT',
    isActive: client.isActive,
    createdAt: new Date().toISOString(),
  };
};
