import { Request, Response } from 'express';
import { toAccountDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const listAccountsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.bankAccount.list.execute({ userId });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    const accountDTOs = result.value.map(toAccountDTO);

    res.json(accountDTOs);
  }
);
