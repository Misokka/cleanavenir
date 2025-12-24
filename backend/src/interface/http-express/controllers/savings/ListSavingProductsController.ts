import { Response } from "express";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { toSavingProductDTO } from "../../mappers/dtoMappers";

export const ListSavingProductsController = asyncHandler(
  async (_, res: Response): Promise<void> => {
    const container = getContainer();

    const listSavingProductsUseCase = container.useCases.saving.listSavingProducts;

    const savingProductsResult = await listSavingProductsUseCase.execute();

    if (!savingProductsResult.ok) {
      res.status(500).json({
        error: "SAVING_PRODUCTS_RETRIEVAL_FAILED",
        message: "Une erreur est survenue lors de la récupération des produits d'épargne.",
      });
      return;
    }

    const mappedSavingProducts = savingProductsResult.value.map(toSavingProductDTO)

    res.status(200).json(mappedSavingProducts);
  }
)