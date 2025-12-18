import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const UpdateSavingProductController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { savingProductId, label, rate } = req.body;

    // Validation
    if (rate === undefined || rate < 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le taux doit être un nombre positif (en basis points)',
      });
      return;
    }

    // changer la rate pour un savingProduct
    const container = getContainer();
    const setGlobalSavingRateUseCase = container.useCases.saving.updateSavingProduct;

    const result = await setGlobalSavingRateUseCase.execute({ savingProductIdentifier: savingProductId, label, rate });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({
      message: "Produit d'épargne modifié avec succès",
      savingProduct: result.value,
    });
  }
);
