import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getLoanByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: loanId } = req.params;
    const userId = req.userId!;

    const container = getContainer();
    const loanRepository = container.repositories.loan;
    const clientRepository = container.repositories.client;

    const clientResult = await clientRepository.findByUserId(userId);
    if (!clientResult.ok) {
      res.status(404).json({
        error: 'CLIENT_NOT_FOUND',
        message: 'Client introuvable',
      });
      return;
    }

    const result = await loanRepository.findById(loanId);

    if (!result.ok) {
      res.status(404).json({
        error: 'LOAN_NOT_FOUND',
        message: 'Prêt introuvable',
      });
      return;
    }

    const loan = result.value;

    if (loan.clientIdentifier !== clientResult.value.clientIdentifier) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Vous n\'avez pas accès à ce prêt',
      });
      return;
    }

    const loanDTO = {
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
    };

    res.json({ loan: loanDTO });
  }
);
