import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

interface CreateAccountRequestBody {
  name: string;
}

export const createAccountController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const { name } = req.body as CreateAccountRequestBody;

    if (!name || name.trim().length === 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le nom du compte est requis',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.bankAccount.create.execute({
      userId: userId,
      name: name.trim(),
    });

    if (!result.ok) {
      res.status(400).json({
        error: 'CREATE_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.status(201).json(result.value);
  }
);
