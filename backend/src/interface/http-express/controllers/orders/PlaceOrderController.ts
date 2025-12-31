import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";

export const PlaceOrderControlller = asyncHandler(
  async (req: Request, res: Response) => {
    const {stockIdentifier, quantity, orderType} = req.body
    const userId = req.userId;

    const container = getContainer();
    const placeOrderUseCase = container.useCases.investment.placeOrder

    const orderResult = await placeOrderUseCase.execute({
      userIdentifier: userId as string,
      stockIdentifier,
      quantity,
      orderType
    });

    if(!orderResult.ok){
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: orderResult.error.message
      })
    }
  }
)