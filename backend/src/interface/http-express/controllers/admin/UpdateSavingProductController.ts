import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const UpdateSavingProductController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { label, rate } = req.body;
    const id = req.params.id;

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
    const updateSavingProductUseCase = container.useCases.saving.updateSavingProduct;

    const result = await updateSavingProductUseCase.execute({ savingProductIdentifier: id, label, rate });

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
