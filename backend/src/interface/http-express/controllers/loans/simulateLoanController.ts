import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const simulateLoanController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { amount, durationInMonth, annualInterestRate, annualInsuranceRate } = req.body;

    // Validation
    if (!amount || !durationInMonth || annualInterestRate === undefined || annualInsuranceRate === undefined) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Tous les champs sont requis: amount, durationInMonth, annualInterestRate, annualInsuranceRate',
      });
      return;
    }

    if (amount <= 0 || durationInMonth <= 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le montant et la durée doivent être supérieurs à 0',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.client.loan.simulate.execute({
      amount,
      durationInMonth,
      annualInterestRate,
      annualInsuranceRate,
    });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      simulation: result.value,
    });
  }
);
