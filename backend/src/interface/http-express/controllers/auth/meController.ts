import { Request, Response } from 'express';
import { toUserDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { db } from '../../../../infrastructure/drizzle/client';
import { users } from '../../../../infrastructure/drizzle/schema';
import { eq } from 'drizzle-orm';


export const meController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    res.json(toUserDTO(user));
  }
);
