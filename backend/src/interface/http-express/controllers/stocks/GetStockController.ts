import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toStockDTO } from "../../mappers/dtoMappers";

export const GetStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const {stockId} = req.params;
    const container = getContainer();

    const getStockUseCase = container.useCases.investment.getStock;
    const stockResult = await getStockUseCase.execute({stockId});

    if(!stockResult.ok) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: stockResult.error.message
      })
    }

    const stock = stockResult.value

    return res.status(200).json({
      stock: toStockDTO(stock.stock, stock.company)
    })
  }
)