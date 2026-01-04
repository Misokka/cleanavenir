import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { toAccountDTO } from '../../mappers/dtoMappers';

interface CreateAccountForClientBody {
  name: string;
}

/**
 * Controller admin: créer un compte bancaire pour un client
 * POST /admin/clients/:userId/accounts
 */
export const createAccountForClientController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { name } = req.body as CreateAccountForClientBody;

    if (!name || name.trim().length === 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le nom du compte est requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.director.createAccountForClient.execute({
      targetUserId: userId,
      name: name.trim(),
    });

    if (!result.ok) {
      if (result.error.message.includes('introuvable')) {
        res.status(404).json({
          error: 'CLIENT_NOT_FOUND',
          message: result.error.message,
        });
        return;
      }

      res.status(400).json({
        error: 'CREATE_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(201).json({
      message: 'Compte créé avec succès',
      account: toAccountDTO(result.value),
    });
  }
);
