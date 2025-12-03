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
    const response = await fetcher<{ companies: Company[] }>('/api/director/companies', {
      method: 'GET',
    });
    return response.companies || [];
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

export const getCompanyById = async (companyId: string): Promise<Company | null> => {
  try {
    const response = await fetcher<{ company: Company }>(`/api/director/companies/${companyId}`, {
      method: 'GET',
    });
    return response.company;
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error);
    return null;
  }
};

export const createCompany = async (payload: CreateCompanyPayload): Promise<Company> => {
  try {
    const response = await fetcher<{ company: Company }>('/api/director/companies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.company;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (companyId: string, payload: UpdateCompanyPayload): Promise<Company> => {
  try {
    const response = await fetcher<{ company: Company }>(`/api/director/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response.company;
  } catch (error) {
    console.error(`Error updating company ${companyId}:`, error);
    throw error;
  }
};

export const deleteCompany = async (companyId: string): Promise<boolean> => {
  try {
    await fetcher(`/api/director/companies/${companyId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error(`Error deleting company ${companyId}:`, error);
    throw error;
  }
};
