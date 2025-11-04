import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const logoutController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // TODO: Si implémentation d'une blacklist de tokens, ajouter le token actuel ici
    // const token = req.headers.authorization?.substring(7);
    // await addToBlacklist(token);

    res.json({
      message: 'Déconnexion réussie',
    });
  }
);
