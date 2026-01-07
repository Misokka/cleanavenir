import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";

export const CancelOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const {orderId} = req.params;

    const container = getContainer();
    const cancelOrderUseCase = container.useCases.investment.cancelOrder;

    const cancelResult = await cancelOrderUseCase.execute({userIdentifier: userId, orderIdentifier: orderId});
    if(!cancelResult.ok) {
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: cancelResult.error.message
      })
    }
    const canceledOrder = cancelResult.value;

    return res.status(200).json({
      success: canceledOrder,
      message: "Order canceled successfully"
    })
  }
)