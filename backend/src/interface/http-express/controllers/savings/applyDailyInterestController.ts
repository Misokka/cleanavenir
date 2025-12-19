import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const applyDailyInterestController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const container = getContainer();
    const result = await container.useCases.saving.applySavingDailyInterest.execute();

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      message: 'Intérêts journaliers appliqués avec succès',
    });
  }
);
