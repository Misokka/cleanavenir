import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const listPendingLoansController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const container = getContainer();
    const listPendingLoansUseCase = container.useCases.loan.listPendingLoans;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
      return;
    }

    const result = await listPendingLoansUseCase.execute({ userId });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    const loansDTO = result.value.map((loan) => ({
      id: loan.loanIdentifier,
      clientId: loan.clientIdentifier,
      advisorId: loan.advisorIdentifier,
      loanAmount: loan.loanAmount,
      durationInMonth: loan.durationInMonth,
      mensualities: loan.mensualities,
      insuranceMensualities: loan.insuranceMensualities,
      remainingAmountToPay: loan.remainingAmountToPay,
      annualInterestRate: loan.annualInterestRate,
      annualInsuranceRate: loan.annualInsuranceRate,
      status: loan.status,
      createdAt: loan.createdAt.toISOString(),
      lastPaidAt: loan.lastPaidAt instanceof Date && !isNaN(loan.lastPaidAt.getTime()) ? loan.lastPaidAt.toISOString() : undefined,
      nextToPayAt: loan.nextToPayAt instanceof Date && !isNaN(loan.nextToPayAt.getTime()) ? loan.nextToPayAt.toISOString() : undefined,
    }));

    res.json({ loans: loansDTO });
  }
);
