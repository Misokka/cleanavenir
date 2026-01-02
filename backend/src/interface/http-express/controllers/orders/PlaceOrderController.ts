import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toOrderDTO } from "../../mappers/dtoMappers";

export const PlaceOrderControlller = asyncHandler(
  async (req: Request, res: Response) => {
    const {stockId, quantity, type} = req.body
    const userId = req.userId;

    const container = getContainer();
    const stockRepository = container.repositories.stock
    const placeOrderUseCase = container.useCases.investment.placeOrder

    const orderResult = await placeOrderUseCase.execute({
      userIdentifier: userId as string,
      stockIdentifier: stockId,
      quantity,
      orderType: type
    });

    if(!orderResult.ok){
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: orderResult.error.message
      });
      return;
    }

    const order = orderResult.value;
    const stockResult = await stockRepository.findById(order.stockIdentifier);
    if(!stockResult.ok){
      return res.status(404).json({
        error: "NOT_FOUND_ERROR",
        message: stockResult.error.message
      })
    }

    const stock = stockResult.value;

    return res.status(200).json({
      message: "Ordre crée avec succès.",
      order: toOrderDTO(order, stock)
    })

  }
)