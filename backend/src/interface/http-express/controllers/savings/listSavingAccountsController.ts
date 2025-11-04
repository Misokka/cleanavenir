import { Request, Response } from 'express';
import { db } from '../../../../infrastructure/drizzle/client';
import { savings, bankAccounts } from '../../../../infrastructure/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';
import { toSavingAccountDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';

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

    const userAccounts = await db.query.bankAccounts.findMany({
      where: eq(bankAccounts.ownerId, userId),
    });

    if (userAccounts.length === 0) {
      res.json([]);
      return;
    }

    const accountIds = userAccounts.map((account) => account.id);

    const savingAccounts = await db.query.savings.findMany({
      where: inArray(savings.accountId, accountIds),
    });

    const savingDTOs = savingAccounts.map(toSavingAccountDTO);

    res.json(savingDTOs);
  }
);
