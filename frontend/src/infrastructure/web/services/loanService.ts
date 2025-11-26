import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

export interface LoanDTO {
  id: string;
  clientId: string;
  advisorId: string;
  loanAmount: number;
  durationInMonth: number;
  monthlyPayment: number;
  monthlyInsurance: number;
  remainingAmountToPay: number;
  annualInterestRate: number;
  annualInsuranceRate: number;
  status: 'PENDING' | 'ACTIVE' | 'CLOSED' | 'REJECTED';
  createdAt: string;
  closedAt?: string;
  nextPaymentDate?: string;
}

export interface LoanSimulation {
  monthlyPayment: number;
  totalInterest: number;
  totalInsurance: number;
  totalCost: number;
}

export interface SimulateLoanRequest {
  amount: number;
  durationInMonth: number;
  annualInterestRate: number;
  annualInsuranceRate: number;
}

export interface RequestLoanRequest {
  amount: number;
  durationInMonth: number;
  annualInterestRate: number;
  annualInsuranceRate: number;
}

export class LoanService {
  async simulateLoan(data: SimulateLoanRequest): Promise<LoanSimulation> {
    try {
      const response = await httpClient.post<{ simulation: LoanSimulation }>(
        API_ENDPOINTS.LOANS.SIMULATE,
        data
      );
      return response.data.simulation;
    } catch (error) {
      console.error('Erreur lors de la simulation du prêt:', error);
      throw error;
    }
  }

  async requestLoan(data: RequestLoanRequest): Promise<LoanDTO> {
    try {
      const response = await httpClient.post<{ loan: LoanDTO }>(
        API_ENDPOINTS.LOANS.REQUEST,
        data
      );
      return response.data.loan;
    } catch (error) {
      console.error('Erreur lors de la demande de prêt:', error);
      throw error;
    }
  }

  async getLoans(): Promise<LoanDTO[]> {
    try {
      const response = await httpClient.get<{ loans: LoanDTO[] }>(
        API_ENDPOINTS.LOANS.LIST
      );
      return response.data.loans;
    } catch (error) {
      console.error('Erreur lors de la récupération des prêts:', error);
      throw error;
    }
  }

  async getLoanById(loanId: string): Promise<LoanDTO> {
    try {
      const response = await httpClient.get<{ loan: LoanDTO }>(
        API_ENDPOINTS.LOANS.DETAILS(loanId)
      );
      return response.data.loan;
    } catch (error) {
      console.error('Erreur lors de la récupération du prêt:', error);
      throw error;
    }
  }

  async approveLoan(loanId: string): Promise<LoanDTO> {
    try {
      const response = await httpClient.post<{ loan: LoanDTO }>(
        API_ENDPOINTS.LOANS.APPROVE(loanId)
      );
      return response.data.loan;
    } catch (error) {
      console.error('Erreur lors de l\'approbation du prêt:', error);
      throw error;
    }
  }
}

export const loanService = new LoanService();
