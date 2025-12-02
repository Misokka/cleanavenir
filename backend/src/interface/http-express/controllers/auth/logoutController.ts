import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { clearTokenCookies } from '../../../../infrastructure/adapters/JwtService';

export const logoutController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    clearTokenCookies(res);

    res.json({
      message: 'Déconnexion réussie',
    });
  }
);
