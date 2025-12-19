import { Request, Response } from 'express';
import { toOperationDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const listRecentOperationsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    const limit = Number.parseInt(req.query.limit as string) || 5;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const container = getContainer();
    const result = await container.useCases.transaction.listRecent.execute({
      userId,
      limit,
    });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    const operationDTOs = result.value.map(toOperationDTO);

    res.json(operationDTOs);
  }
);
