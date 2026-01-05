import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getStatisticsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const container = getContainer();
    const clientRepository = container.repositories.client;
    const accountRepository = container.repositories.bankAccount;
    const transactionRepository = container.repositories.transaction;
    const loanRepository = container.repositories.loan;
    const stockRepository = container.repositories.stock;

    const clientsResult = await clientRepository.all();
    const accountsResult = await accountRepository.all();
    
    const totalOperations = 0;

    const loansResult = await loanRepository.all();
    const activeLoans = loansResult.ok 
      ? loansResult.value.filter((loan) => loan.status === 'ACTIVE')
      : [];

    const stocksResult = await stockRepository.allAvailableStocks();
    const availableStocks = stocksResult.ok ? stocksResult.value.length : 0;

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
        availableStocks,
      },
    });
  }
);
