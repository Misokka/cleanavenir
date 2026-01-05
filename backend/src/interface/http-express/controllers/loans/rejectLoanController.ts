import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const rejectLoanController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id: loanId } = req.params;

    const container = getContainer();
    const rejectLoanUseCase = container.useCases.loan.rejectLoan;

    const result = await rejectLoanUseCase.execute({
      loanIdentifier: loanId,
    });

    if (!result.ok) {
      if (result.error.message.includes('introuvable')) {
        res.status(404).json({
          error: 'LOAN_NOT_FOUND',
          message: result.error.message,
        });
        return;
      }

      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      message: 'Prêt rejeté avec succès',
      loan: result.value,
    });
  }
);
