import { httpClient } from '@/infrastructure/web/httpClient';

export interface Company {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyPayload {
  name: string;
  description: string;
}

export interface UpdateCompanyPayload {
  name?: string;
  description?: string;
}

export const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const response = await httpClient.get<{ companies: Company[] }>('/director/companies');
    return response.data.companies || [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

export const getCompanyById = async (companyId: string): Promise<Company | null> => {
  try {
    const response = await httpClient.get<{ company: Company }>(`/director/companies/${companyId}`);
    return response.data.company;
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error);
    return null;
  }
};

export const createCompany = async (payload: CreateCompanyPayload): Promise<Company> => {
  try {
    const response = await httpClient.post<{ company: Company }>('/director/companies', payload);
    return response.data.company;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (companyId: string, payload: UpdateCompanyPayload): Promise<Company> => {
  try {
    const response = await httpClient.put<{ company: Company }>(`/director/companies/${companyId}`, payload);
    return response.data.company;
  } catch (error) {
    console.error(`Error updating company ${companyId}:`, error);
    throw error;
  }
};

export const deleteCompany = async (companyId: string): Promise<boolean> => {
  try {
    await httpClient.delete(`/director/companies/${companyId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting company ${companyId}:`, error);
    throw error;
  }
};
