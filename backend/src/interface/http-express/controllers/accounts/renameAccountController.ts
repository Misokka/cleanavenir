import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

interface RenameAccountRequestBody {
  name: string;
}

export const renameAccountController = asyncHandler(
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

    const { name } = req.body as RenameAccountRequestBody;

    if (!name || name.trim().length === 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le nouveau nom est requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.bankAccount.rename.execute({
      accountId,
      newName: name.trim(),
      userId,
    });

    if (!result.ok) {
      if (result.error.message.includes('trouvable') || result.error.message.includes('not found')) {
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

      res.status(400).json({
        error: 'RENAME_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json(result.value);
  }
);
