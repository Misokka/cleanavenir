import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toOrderDTO } from "../../mappers/dtoMappers";

export const ShowBestBuyAndSellOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const container = getContainer();

    const showBestBuyAndSellOrderUseCase = container.useCases.investment.showBestBuyAndSellOrder;
    const ordersResult = await showBestBuyAndSellOrderUseCase.execute({stockId});
    if(!ordersResult.ok) {
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: ordersResult.error.message
      })
    }

    const orders = ordersResult.value;
    const {bestBuy, bestSell} = orders

    return res.status(200).json({
      bestBuyOrder: bestBuy && bestBuy.order ? toOrderDTO(bestBuy.order, bestBuy.stock) : null,
      bestSellOrder: bestSell && bestSell.order ? toOrderDTO(bestSell.order, bestSell.stock) : null
    })
  }
)