import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getStatisticsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const container = getContainer();
    const clientRepository = container.repositories.client;
    const accountRepository = container.repositories.bankAccount;
    const operationRepository = container.repositories.transaction;
    const loanRepository = container.repositories.loan;

    // Récupérer les statistiques
    const clientsResult = await clientRepository.all();
    const accountsResult = await accountRepository.all();
    
    // Compter les opérations (approximation - vous pouvez améliorer)
    const totalOperations = 0; // TODO: implémenter countAll() dans le repository

    // Compter les prêts actifs
    const loansResult = await loanRepository.all();
    const activeLoans = loansResult.ok 
      ? loansResult.value.filter((loan) => loan.status === 'ACTIVE')
      : [];

    res.json({
      statistics: {
        totalClients: clientsResult.ok ? clientsResult.value.length : 0,
        totalAccounts: accountsResult.ok ? accountsResult.value.length : 0,
        totalOperations,
        activeLoans: activeLoans.length,
        totalLoanAmount: activeLoans.reduce(
          (sum, loan) => sum + loan.loanAmount,
          0
        ),
      },
    });
  }
);
