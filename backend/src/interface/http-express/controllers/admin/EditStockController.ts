import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { StockToEditType } from "../../../../application/use-cases/director/stock/EditStockUseCase";

export const EditStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const { ticker, isAvailable } = req.body;

    const container = getContainer();
    const editStockUseCase = container.useCases.investment.editStock;

    const stockToEdit: StockToEditType = {
      id: stockId,
      ticker,
      isAvailable
    }

    const editResult = await editStockUseCase.execute({stockToEdit});
    if(!editResult.ok) {
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: editResult.error.message
      })
    }

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully."
    });
  }
)