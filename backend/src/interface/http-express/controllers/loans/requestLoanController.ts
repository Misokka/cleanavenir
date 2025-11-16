import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const requestLoanController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { amount, durationInMonth, annualInterestRate, annualInsuranceRate } = req.body;
    const clientId = req.userId!; // Fourni par requireAuth

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
    const result = await container.useCases.client.loan.request.execute({
      clientId,
      amount,
      durationInMonth,
      annualInterestRate,
      annualInsuranceRate,
    });

    if (!result.ok) {
      const error = result.error;
      
      if (error.message.includes('introuvable')) {
        res.status(404).json({
          error: 'CLIENT_NOT_FOUND',
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
      return;
    }

    res.status(201).json({
      message: 'Demande de prêt créée avec succès',
      loan: result.value,
    });
  }
);
