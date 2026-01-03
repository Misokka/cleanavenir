import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toStockHistoryDTO } from "../../mappers/dtoMappers";

export const GetStockPriceHistoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const {stockId} = req.params;

    const container = getContainer();
    const getStockPriceHistoryUseCase = container.useCases.investment.getStockPriceHistory;

    const stockPriceHistoryResult = await getStockPriceHistoryUseCase.execute({stockId});
    if(!stockPriceHistoryResult.ok){
      return res.status(500).json({
        error: "UNEXPECTED_ERROR",
        message: stockPriceHistoryResult.error.message
      });
    }

    const stockPriceHistory = stockPriceHistoryResult.value;

    return res.status(200).json({
      stockPriceHistory: toStockHistoryDTO(stockPriceHistory.stock, stockPriceHistory.stockPriceHistory)
    })
  }
)