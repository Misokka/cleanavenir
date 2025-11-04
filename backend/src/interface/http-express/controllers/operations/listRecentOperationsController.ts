import { Request, Response } from 'express';
import { db } from '../../../../infrastructure/drizzle/client';
import { operations, bankAccounts } from '../../../../infrastructure/drizzle/schema';
import { eq, or, desc, inArray } from 'drizzle-orm';
import { toOperationDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';

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

    const userAccounts = await db.query.bankAccounts.findMany({
      where: eq(bankAccounts.ownerId, userId),
    });

    if (userAccounts.length === 0) {
      res.json([]);
      return;
    }

    const accountIds = userAccounts.map((account) => account.id);

    const recentOps = await db.query.operations.findMany({
      where: or(
        inArray(operations.fromAccountId, accountIds),
        inArray(operations.toAccountId, accountIds)
      ),
      orderBy: [desc(operations.createdAt)],
      limit,
    });

    const operationDTOs = recentOps.map(toOperationDTO);

    res.json(operationDTOs);
  }
);
