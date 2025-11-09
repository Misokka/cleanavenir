import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

interface TransferRequestBody {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

export const transferController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const { fromAccountId, toAccountId, amount, description } = req.body as TransferRequestBody;

    if (!fromAccountId || !toAccountId) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Les comptes source et destination sont requis',
      });
      return;
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le montant doit être un nombre positif',
      });
      return;
    }

    const amountInCents = Math.round(amount * 100);

    const container = getContainer();
    const result = await container.useCases.operation.transfer.execute({
      fromAccountId,
      toAccountId,
      amount: amountInCents,
      description,
      userId,
    });

    if (!result.ok) {
      res.status(400).json({
        error: 'TRANSFER_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Virement effectué avec succès',
    });
  }
);
