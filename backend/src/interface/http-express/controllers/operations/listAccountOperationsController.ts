import { Request, Response } from 'express';
import { db } from '../../../../infrastructure/drizzle/client';
import { operations, bankAccounts } from '../../../../infrastructure/drizzle/schema';
import { eq, or, and, desc } from 'drizzle-orm';
import { toOperationDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const listAccountOperationsController = asyncHandler(
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

    const account = await db.query.bankAccounts.findFirst({
      where: and(
        eq(bankAccounts.id, accountId),
        eq(bankAccounts.ownerId, userId)
      ),
    });

    if (!account) {
      res.status(404).json({
        error: 'ACCOUNT_NOT_FOUND',
        message: 'Compte non trouvé',
      });
      return;
    }

    const accountOperations = await db.query.operations.findMany({
      where: or(
        eq(operations.fromAccountId, accountId),
        eq(operations.toAccountId, accountId)
      ),
      orderBy: [desc(operations.createdAt)],
    });

    const operationDTOs = accountOperations.map(toOperationDTO);

    res.json(operationDTOs);
  }
);
