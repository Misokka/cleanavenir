import { Request, Response } from 'express';
import { toSavingAccountDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const listSavingAccountsController = asyncHandler(
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
    const result = await container.useCases.saving.listUser.execute({ userId });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    const savingDTOs = result.value.map(toSavingAccountDTO);

    res.json(savingDTOs);
  }
);
