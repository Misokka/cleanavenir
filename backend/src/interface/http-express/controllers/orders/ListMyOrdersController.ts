import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toOrderDTO } from "../../mappers/dtoMappers";

export const ListMyOrdersController = asyncHandler(
  async(req: Request, res: Response) => {
    const userId = req.userId as string
    const container = getContainer();

    const listMyOrdersUseCase = container.useCases.investment.listMyOrders

    const ordersResult = await listMyOrdersUseCase.execute({userId});
    if(!ordersResult.ok) {
      return res.status(500).json({
        error: "NOT_FOUND_ERROR",
        message: ordersResult.error.message
      })
    }

    const orders = ordersResult.value;
    const mappedOrders = orders.map((or) => {
      return toOrderDTO(or.order, or.stock)
    })

    return res.status(200).json({
      orders: mappedOrders
    })
  }
)