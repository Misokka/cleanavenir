import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

export interface LoanDTO {
  id: string;
  clientId: string;
  advisorId: string;
  loanAmount: number;
  durationInMonth: number;
  mensualities: number;
  insuranceMensualities: number;
  remainingAmountToPay: number;
  annualInterestRate: number;
  annualInsuranceRate: number;
  status: 'PENDING' | 'ACTIVE' | 'PAID_OFF' | 'REJECTED';
  createdAt: string;
  lastPaidAt?: string;
  nextToPayAt?: string;
}

export interface AdvisorStatsDTO {
  totalClients: number;
  activeLoans: number;
  pendingLoans: number;
  totalLoanAmount: number;
}

export interface BankAccountDTO {
  id: string;
  name: string;
  iban: string;
  balance: number;
}

export interface ClientAccountsDTO {
  clientId: string;
  accounts: BankAccountDTO[];
  totalBalance: number;
}

export interface ClientInfoDTO {
  clientId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class AdvisorService {
  async getPendingLoans(): Promise<LoanDTO[]> {
    try {
      const response = await httpClient.get<{ loans: LoanDTO[] }>(
        API_ENDPOINTS.LOANS.PENDING
      );
      return response.data.loans;
    } catch (error) {
      console.error('Erreur lors de la récupération des prêts en attente:', error);
      throw error;
    }
  }

  async approveLoan(loanId: string): Promise<LoanDTO> {
    try {
      const response = await httpClient.post<{ message: string; loan: LoanDTO }>(
        API_ENDPOINTS.LOANS.APPROVE(loanId)
      );
      return response.data.loan;
    } catch (error) {
      console.error(`Erreur lors de l'approbation du prêt ${loanId}:`, error);
      throw error;
    }
  }

  async rejectLoan(loanId: string): Promise<LoanDTO> {
    try {
      const response = await httpClient.post<{ message: string; loan: LoanDTO }>(
        API_ENDPOINTS.LOANS.REJECT(loanId)
      );
      return response.data.loan;
    } catch (error) {
      console.error(`Erreur lors du rejet du prêt ${loanId}:`, error);
      throw error;
    }
  }

  async getMyClients(): Promise<LoanDTO[]> {
    try {
      const response = await httpClient.get<{ loans: LoanDTO[] }>(
        API_ENDPOINTS.LOANS.ADVISOR_CLIENTS
      );
      return response.data.loans;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  }

  async getClientAccounts(clientId: string): Promise<ClientAccountsDTO> {
    try {
      const response = await httpClient.get<ClientAccountsDTO>(
        `/loans/advisor/client/${clientId}/accounts`
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des comptes du client ${clientId}:`, error);
      throw error;
    }
  }

  async getClientInfo(clientId: string): Promise<ClientInfoDTO> {
    try {
      const response = await httpClient.get<ClientInfoDTO>(
        `/loans/advisor/client/${clientId}/info`
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des infos du client ${clientId}:`, error);
      throw error;
    }
  }

  async getStats(): Promise<AdvisorStatsDTO> {
    try {
      const allLoans = await this.getMyClients();
      const pendingLoans = await this.getPendingLoans();
      const uniqueClients = new Set(allLoans.map(loan => loan.clientId));
      const activeLoans = allLoans.filter(loan => loan.status === 'ACTIVE');
      const totalLoanAmount = activeLoans.reduce(
        (sum, loan) => sum + loan.remainingAmountToPay,
        0
      );

      return {
        totalClients: uniqueClients.size,
        activeLoans: activeLoans.length,
        pendingLoans: pendingLoans.length,
        totalLoanAmount: totalLoanAmount / 100, // Conversion centimes -> euros
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export const advisorService = new AdvisorService();
