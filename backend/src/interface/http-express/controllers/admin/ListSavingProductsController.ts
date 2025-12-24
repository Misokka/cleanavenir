import { Request, Response } from "express";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { toSavingProductDTO } from "../../mappers/dtoMappers";

export const ListSavingProductsController = asyncHandler(
  async(req: Request, res: Response): Promise<void> => {
    const container = getContainer();
    const listSavingProductsUseCase = container.useCases.saving.listSavingProducts;

    const result = await listSavingProductsUseCase.execute();
    if(!result.ok){
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: result.error.message
      });
      return;
    };

    const savingProducts = result.value;

    res.status(200).json( savingProducts.map(toSavingProductDTO) )
  }
)