import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

/**
 * Controller admin: supprimer un compte bancaire
 * DELETE /admin/accounts/:accountId
 */
export const deleteAccountByDirectorController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { accountId } = req.params;

    const container = getContainer();
    const result = await container.useCases.director.deleteAccountByDirector.execute({
      accountId,
    });

    if (!result.ok) {
      if (result.error.message.includes('introuvable')) {
        res.status(404).json({
          error: 'ACCOUNT_NOT_FOUND',
          message: 'Compte introuvable',
        });
        return;
      }

      if (result.error.message.includes('solde')) {
        res.status(400).json({
          error: 'BALANCE_NOT_ZERO',
          message: result.error.message,
        });
        return;
      }

      res.status(400).json({
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
