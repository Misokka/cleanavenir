import { Request, Response } from 'express';
import { toAccountDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getAccountController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    const accountId = req.params.id;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.bankAccount.get.execute({
      userId,
      accountId,
    });

    if (!result.ok) {
      if (result.error.message.includes('trouvé') || result.error.message.includes('not found')) {
        res.status(404).json({
          error: 'ACCOUNT_NOT_FOUND',
          message: 'Compte non trouvé',
        });
        return;
      }

      if (result.error.message.includes('autorisé') || result.error.message.includes('unauthorized')) {
        res.status(403).json({
          error: 'UNAUTHORIZED',
          message: 'Accès non autorisé à ce compte',
        });
        return;
      }

      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json(toAccountDTO(result.value));
  }
);
