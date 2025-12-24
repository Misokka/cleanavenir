import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { toSavingAccountDTO, toSavingProductDTO } from '../../mappers/dtoMappers';

export const listClientSavingsController = asyncHandler(
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

    const clientResult = await container.repositories.client.findByUserId(userId);
    if(!clientResult.ok){
      res.status(404).json({
        error: 'CLIENT_NOT_FOUND',
        message: 'Compte client introuvable',
      });
      return;
    }

    const client = clientResult.value
    // voir si besoin de récupérer saving product
    // Récupérer l'épargne
    const savingsResult = await container.repositories.saving.findManyByOwner(client.clientIdentifier);

    if (!savingsResult.ok) {
      res.status(500).json({
        error: 'SAVING_NOT_FOUND',
        message: "Une erreur est survenu lors de la récupération des comptes d'épargne.",
      });
      return;
    }

    const savingsAccounts = savingsResult.value;
    const savingProductsResult = await container.repositories.savingProduct.all();
    if (!savingProductsResult.ok) {
      res.status(500).json({
        error: 'SAVING_PRODUCT_NOT_FOUND',
        message: "Une erreur est survenu lors de la récupération des produits d'épargne.",
      });
      return;
    }
    const savingProducts = savingProductsResult.value;

    const processedSavingAccounts = savingsAccounts.map((savingAccount) => {
      const baseSavingAccount = toSavingAccountDTO(savingAccount);
      const savingProduct = savingProducts.find(product => product.savingProductIdentifier === savingAccount.productIdentifier);
      const savingProductDTO = savingProduct ? toSavingProductDTO(savingProduct) : null;
      return {
        ...baseSavingAccount,
        savingProduct: savingProductDTO
      };
    })

    res.status(200).json(processedSavingAccounts);
  }
);
