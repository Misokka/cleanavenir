import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const setSavingRateController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { rate } = req.body;

    // Validation
    if (rate === undefined || rate < 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le taux doit être un nombre positif (en basis points)',
      });
      return;
    }

    const container = getContainer();
    const setGlobalSavingRateUseCase = container.useCases.director.savings.setGlobalRate;

    const result = await setGlobalSavingRateUseCase.execute({ rate });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      message: 'Taux d\'épargne modifié avec succès',
      rate: result.value,
    });
  }
);
