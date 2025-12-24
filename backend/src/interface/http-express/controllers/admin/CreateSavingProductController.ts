import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toSavingProductDTO } from "../../mappers/dtoMappers";

export const CreateSavingProductController = asyncHandler(
  async(req: Request, res: Response): Promise<void> => {
    const {label, rate} = req.body;

    if(!label || !rate){
      res.status(403).json({
        error: "VALIDATION_ERROR",
        message: "Le label et le taux sont requis."
      });

      return;
    };

    const container = getContainer();
    const createSavingProductUseCase = container.useCases.saving.createSavingProduct;

    const result = await createSavingProductUseCase.execute(label, rate);
    if(!result.ok){
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: result.error.message
      });
      return;
    };

    const savingProduct = result.value;

    res.status(200).json({
      savingProduct: toSavingProductDTO(savingProduct)
    })
  }
)