import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { AppError, SavingErrorCodes } from '../../../../shared/errors';

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
      const error = result.error as AppError;
      switch (error.code) {
        case SavingErrorCodes.VALIDATION_ERROR:
          res.status(400).json({ error: error.code });
          return;
        case SavingErrorCodes.SAVING_NOT_FOUND:
        case SavingErrorCodes.TARGET_ACCOUNT_NOT_FOUND:
          res.status(404).json({ error: error.code });
          return;
        case SavingErrorCodes.UNAUTHORIZED_SAVING_ACCOUNT:
        case SavingErrorCodes.UNAUTHORIZED_TARGET_ACCOUNT:
          res.status(403).json({ error: error.code });
          return;
        case SavingErrorCodes.INSUFFICIENT_SOURCE_BALANCE:
          res.status(400).json({ error: error.code });
          return;
        case SavingErrorCodes.DEBIT_SAVING_FAILED:
        case SavingErrorCodes.CREDIT_BANK_FAILED:
        case SavingErrorCodes.TRANSACTION_SAVE_FAILED:
        default:
          res.status(500).json({ error: error.code });
          return;
      }
    }

    res.json({ success: true });
  }
);
