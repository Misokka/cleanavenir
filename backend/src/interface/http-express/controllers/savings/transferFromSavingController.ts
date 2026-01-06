import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const transferFromSavingController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { savingId } = req.params;
    const { targetAccountId, amount } = req.body;
    const userId = req.userId!;

    if (!targetAccountId || !amount) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le compte cible et le montant sont requis',
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
    const transferFromSavingUseCase = container.useCases.saving.transferFromSaving;

    const result = await transferFromSavingUseCase.execute({
      userId,
      savingAccountId: savingId,
      targetBankAccountId: targetAccountId,
      amount,
    });

    if (!result.ok) {
      res.status(400).json({
        error: 'TRANSFER_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      message: 'Transfert effectué avec succès',
      success: true,
    });
  }
);
