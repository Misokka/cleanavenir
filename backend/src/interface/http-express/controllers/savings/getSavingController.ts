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

    const clientResult = await container.repositories.client.findByUserId(userId);
    if (!clientResult.ok) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Client non trouvé',
      });
      return;
    }

    const client = clientResult.value;
    
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

    if (!savingResult.ok || savingResult.value.clientIdentifier !== client.clientIdentifier) {
      res.status(403).json({
        error: 'UNAUTHORIZED',
        message: 'Accès non autorisé à ce compte épargne',
      });
      return;
    }

    const savingProductResult = await container.repositories.savingProduct.findById(saving.productIdentifier);
    if (!savingProductResult.ok) {
      res.status(500).json({
        error: 'SAVING_PRODUCT_NOT_FOUND',
        message: "Une erreur est survenu lors de la récupération du produit d'épargne.",
      });
      return;
    }

    const savingProduct = savingProductResult.value;

    // Convertir centimes → euros
    const savingDTO = {
      id: saving.accountIdentifier,
      clientId: saving.clientIdentifier,
      savingProductId: saving.productIdentifier,
      iban: saving.iban.value,
      label: saving.label,
      balance: saving.balance / 100, // conversion en €
      createdAt: saving.createdAt.toISOString(),
      updatedAt: saving.updatedAt ? saving.updatedAt.toISOString() : null,
      savingProduct: {
        ...savingProduct,
        id: savingProduct.savingProductIdentifier,
        rate: savingProduct.rate, // Le mapper toDomain a déjà converti
      }
    };

    res.json(savingDTO);
  }
);
