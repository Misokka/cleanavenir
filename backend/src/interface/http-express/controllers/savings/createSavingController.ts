import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

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

    const { sourceAccountId, initialAmount, rate } = req.body;

    if (!sourceAccountId || !initialAmount) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le compte source et le montant initial sont requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.saving.create.execute({
      userId,
      sourceAccountId,
      initialAmount: Number.parseFloat(initialAmount),
      rate: rate ? Number.parseFloat(rate) : 2.5, // Taux par défaut 2.5%
    });

    if (!result.ok) {
      const message = result.error.message;
      
      if (message.includes('au moins 10')) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message,
        });
        return;
      }

      if (message.includes('Solde insuffisant')) {
        res.status(400).json({
          error: 'INSUFFICIENT_BALANCE',
          message,
        });
        return;
      }

      if (message.includes('introuvable')) {
        res.status(404).json({
          error: 'ACCOUNT_NOT_FOUND',
          message,
        });
        return;
      }

      if (message.includes('non autorisé')) {
        res.status(403).json({
          error: 'UNAUTHORIZED',
          message,
        });
        return;
      }

      if (message.includes('déjà une épargne')) {
        res.status(409).json({
          error: 'CONFLICT',
          message,
        });
        return;
      }

      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(201).json(result.value);
  }
);
