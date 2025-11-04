import { Request, Response } from 'express';
import { mockCurrentSavingRate } from '../../mappers/dtoMappers';
import { asyncHandler } from '../../middlewares/errorMiddleware';
/**
 * TODO: À remplacer par une vraie query sur une table saving_rates
 * Pour l'instant, retourne un taux mocké pour débloquer l'intégration front
 */
export const getCurrentSavingRateController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Mock pour le développement
    const currentRate = mockCurrentSavingRate();

    // TODO: En production, récupérer depuis la DB
    // const rate = await db.query.savingRates.findFirst({
    //   orderBy: [desc(savingRates.createdAt)],
    //   limit: 1
    // });

    res.json(currentRate);
  }
);
