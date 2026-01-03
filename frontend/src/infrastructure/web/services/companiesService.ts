import { API_ENDPOINTS } from "../endpoints";
import { httpClient } from "../httpClient";


export type Company = {
  id: string,
  name: string,
  description: string,
  // add other relevant fields
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
}

export const companiesService = new CompaniesService();