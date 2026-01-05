import { API_ENDPOINTS } from "../endpoints";
import { httpClient } from "../httpClient";


export type Company = {
  id: string,
  name: string,
  description: string,
  createdAt: string,
  updatedAt: string,
}

export type CreateCompanyPayload = {
  name: string;
  description: string;
}

export type UpdateCompanyPayload = {
  name?: string;
  description?: string;
}

class CompaniesService {
  async listCompanies(): Promise<Company[]> {
    try{
      const response = await httpClient.get<{ companies: Company[] }>(
        API_ENDPOINTS.COMPANIES.LIST
      );
      return response.data.companies;
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises :', error);
      throw error;
    }
  }

  async getCompanyById(companyId: string): Promise<Company> {
    try {
      const response = await httpClient.get<{ company: Company }>(
        `${API_ENDPOINTS.COMPANIES.LIST}/${companyId}`
      );
      return response.data.company;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'entreprise ${companyId}:`, error);
      throw error;
    }
  }

  async createCompany(payload: CreateCompanyPayload): Promise<Company> {
    try {
      const response = await httpClient.post<{ company: Company }>(
        API_ENDPOINTS.COMPANIES.LIST,
        payload
      );
      return response.data.company;
    } catch (error) {
      console.error("Erreur lors de la création de l'entreprise:", error);
      throw error;
    }
  }

  async updateCompany(companyId: string, payload: UpdateCompanyPayload): Promise<Company> {
    try {
      const response = await httpClient.put<{ company: Company }>(
        `${API_ENDPOINTS.COMPANIES.LIST}/${companyId}`,
        payload
      );
      return response.data.company;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'entreprise ${companyId}:`, error);
      throw error;
    }
  }

  async deleteCompany(companyId: string): Promise<void> {
    try {
      await httpClient.delete(`${API_ENDPOINTS.COMPANIES.LIST}/${companyId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'entreprise ${companyId}:`, error);
      throw error;
    }
  }
}

export const companiesService = new CompaniesService();