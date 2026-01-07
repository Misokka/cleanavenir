import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { AppError, SavingErrorCodes } from '../../../../shared/errors';

export const createSavingController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const { sourceAccountId, savingProductId, initialAmount } = req.body;

    if (!sourceAccountId || !initialAmount) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le compte source et le montant initial sont requis',
      });
      return;
    }

    // Créer un controller createSavingProductController
    const container = getContainer();
    const result = await container.useCases.saving.create.execute({
      userId,
      sourceAccountId,
      initialAmount: Number.parseFloat(initialAmount),
      savingProductIdentifier: savingProductId
    });

    if (!result.ok) {
      const error = result.error as AppError;
      switch (error.code) {
        case SavingErrorCodes.INITIAL_AMOUNT_BELOW_MIN:
        case SavingErrorCodes.VALIDATION_ERROR:
          res.status(400).json({ error: error.code });
          return;
        case SavingErrorCodes.INSUFFICIENT_SOURCE_BALANCE:
          res.status(400).json({ error: error.code });
          return;
        case SavingErrorCodes.SOURCE_ACCOUNT_NOT_FOUND:
        case SavingErrorCodes.SAVING_PRODUCT_NOT_FOUND:
          res.status(404).json({ error: error.code });
          return;
        case SavingErrorCodes.UNAUTHORIZED_SOURCE_ACCOUNT:
          res.status(403).json({ error: error.code });
          return;
        case SavingErrorCodes.SAVING_ALREADY_EXISTS:
          res.status(409).json({ error: error.code });
          return;
        case SavingErrorCodes.IBAN_GENERATION_FAILED:
        case SavingErrorCodes.IBAN_INVALID:
        case SavingErrorCodes.DEBIT_SOURCE_FAILED:
        case SavingErrorCodes.TRANSACTION_SAVE_FAILED:
        case SavingErrorCodes.INTERNAL_ERROR:
        default:
          res.status(500).json({ error: error.code });
          return;
      }
    }

    res.status(201).json(result.value);
  }
);
