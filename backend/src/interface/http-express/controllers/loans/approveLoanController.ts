import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const approveLoanController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: loanId } = req.params;
    const advisorId = req.userId!; // L'ID du conseiller connecté

    const container = getContainer();
    const grantLoanUseCase = container.useCases.loan.grantLoan;

    // Récupérer le prêt pour obtenir les détails
    const loanResult = await container.repositories.loan.findById(loanId);

    if (!loanResult.ok) {
      res.status(404).json({
        error: 'LOAN_NOT_FOUND',
        message: 'Prêt introuvable',
      });
      return;
    }

    const loan = loanResult.value;

    // Approuver le prêt
    const result = await grantLoanUseCase.execute({
      clientIdentifier: loan.clientIdentifier,
      advisorIdentifier: advisorId,
      loanAmount: loan.loanAmount,
      durationInMonth: loan.durationInMonth,
      annualInterestRate: loan.annualInterestRate,
      annualInsuranceRate: loan.annualInsuranceRate
    });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      message: 'Prêt approuvé avec succès',
      loan: result.value,
    });
  }
);
