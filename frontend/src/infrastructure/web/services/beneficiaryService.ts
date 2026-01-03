import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

export interface BeneficiaryDTO {
  id: string;
  beneficiaryIdentifier: string;
  clientIdentifier: string;
  iban: string;
  label: string;
  accountName?: string;
  createdAt: string;
}

export interface CreateBeneficiaryDTO {
  iban: string;
  label: string;
  accountName?: string;
}

export interface UpdateBeneficiaryLabelDTO {
  label: string;
}

export class BeneficiaryService {
  async listBeneficiaries(): Promise<BeneficiaryDTO[]> {
    try {
      const response = await httpClient.get<BeneficiaryDTO[]>(
        API_ENDPOINTS.BENEFICIARIES.LIST
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des bénéficiaires:', error);
      throw error;
    }
  }

  async getBeneficiaryById(id: string): Promise<BeneficiaryDTO> {
    if (!id) {
      throw new Error('ID de bénéficiaire requis');
    }

    try {
      const response = await httpClient.get<BeneficiaryDTO>(
        API_ENDPOINTS.BENEFICIARIES.DETAILS(id)
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du bénéficiaire:', error);
      throw error;
    }
  }

  async addBeneficiary(data: CreateBeneficiaryDTO): Promise<BeneficiaryDTO> {
    if (!data.iban || !data.label) {
      throw new Error('IBAN et libellé requis');
    }

    try {
      const response = await httpClient.post<BeneficiaryDTO>(
        API_ENDPOINTS.BENEFICIARIES.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du bénéficiaire:', error);
      throw error;
    }
  }

  async updateBeneficiaryLabel(
    id: string,
    data: UpdateBeneficiaryLabelDTO
  ): Promise<BeneficiaryDTO> {
    if (!id) {
      throw new Error('ID de bénéficiaire requis');
    }

    if (!data.label) {
      throw new Error('Nouveau libellé requis');
    }

    try {
      const response = await httpClient.put<BeneficiaryDTO>(
        API_ENDPOINTS.BENEFICIARIES.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bénéficiaire:', error);
      throw error;
    }
  }

  async deleteBeneficiary(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID de bénéficiaire requis');
    }

    try {
      await httpClient.delete(API_ENDPOINTS.BENEFICIARIES.DELETE(id));
    } catch (error) {
      console.error('Erreur lors de la suppression du bénéficiaire:', error);
      throw error;
    }
  }
}

export const beneficiaryService = new BeneficiaryService();
