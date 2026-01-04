import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { toAccountDTO } from '../../mappers/dtoMappers';

interface RenameAccountBody {
  newName: string;
}

/**
 * Controller admin: renommer un compte bancaire
 * PUT /admin/accounts/:accountId/rename
 */
export const renameAccountByDirectorController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { accountId } = req.params;
    const { newName } = req.body as RenameAccountBody;

    if (!newName || newName.trim().length === 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le nouveau nom est requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.director.renameAccountByDirector.execute({
      accountId,
      newName: newName.trim(),
    });

    if (!result.ok) {
      if (result.error.message.includes('introuvable')) {
        res.status(404).json({
          error: 'ACCOUNT_NOT_FOUND',
          message: 'Compte introuvable',
        });
        return;
      }

      res.status(400).json({
        error: 'RENAME_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(200).json({
      message: 'Compte renommé avec succès',
      account: toAccountDTO(result.value),
    });
  }
);
