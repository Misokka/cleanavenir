import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getSavingController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    const savingId = req.params.id;

    if (!userId) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Non authentifié',
      });
      return;
    }

    const container = getContainer();
    
    // Récupérer l'épargne
    const savingResult = await container.repositories.saving.findById(savingId);

    if (!savingResult.ok) {
      res.status(404).json({
        error: 'SAVING_NOT_FOUND',
        message: 'Compte épargne introuvable',
      });
      return;
    }

    const saving = savingResult.value;

    if (!savingResult.ok || savingResult.value.clientIdentifier !== userId) {
      res.status(403).json({
        error: 'UNAUTHORIZED',
        message: 'Accès non autorisé à ce compte épargne',
      });
      return;
    }

    // Convertir centimes → euros et basis points → pourcentage
    const savingDTO = {
      id: saving.accountIdentifier,
      clientId: saving.clientIdentifier,
      savingProductId: saving.productIdentifier,
      iban: saving.iban.value,
      label: saving.label,
      balance: saving.balance / 100, // conversion en €
      createdAt: saving.createdAt.toISOString(),
    };

    res.json(savingDTO);
  }
);
