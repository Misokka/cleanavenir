import { Request, Response } from 'express';
import { db } from '../../../../infrastructure/drizzle/client';
import { bankAccounts } from '../../../../infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';
import { toAccountDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';

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

    const accounts = await db.query.bankAccounts.findMany({
      where: eq(bankAccounts.ownerId, userId),
    });

    const accountDTOs = accounts.map(toAccountDTO);

    res.json(accountDTOs);
  }
);
