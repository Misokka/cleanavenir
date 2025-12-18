import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const deleteAccountController = asyncHandler(
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
    const result = await container.useCases.bankAccount.delete.execute({
      accountId,
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

      if (result.error.message.includes('solde')) {
        res.status(400).json({
          error: 'BALANCE_NOT_ZERO',
          message: 'Impossible de supprimer un compte avec un solde non nul',
        });
        return;
      }

      res.status(500).json({
        error: 'DELETE_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Compte supprimé avec succès',
    });
  }
);
