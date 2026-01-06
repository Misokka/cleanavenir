import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const depositToSavingController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { savingId } = req.params;
    const { sourceAccountId, amount } = req.body;
    const userId = req.userId!;

    if (!sourceAccountId || !amount) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le compte source et le montant sont requis',
      });
      return;
    }

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le montant doit être un nombre positif',
      });
      return;
    }

    const container = getContainer();
    const depositToSavingUseCase = container.useCases.saving.depositToSaving;

    const result = await depositToSavingUseCase.execute({
      userId,
      savingAccountId: savingId,
      sourceBankAccountId: sourceAccountId,
      amount,
    });

    if (!result.ok) {
      res.status(400).json({
        error: 'DEPOSIT_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      message: 'Dépôt effectué avec succès',
      success: true,
    });
  }
);
