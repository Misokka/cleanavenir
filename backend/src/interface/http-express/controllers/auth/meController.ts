import { Request, Response } from 'express';
import { toUserDTO } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

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

    const container = getContainer();
    const result = await container.useCases.auth.getUserProfile.execute(userId);

    if (!result.ok) {
      res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    res.json(toUserDTO(result.value));
  }
);
