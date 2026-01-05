  import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const UpdateStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const { stockId } = req.params;
    const { ticker, price, isAvailable } = req.body;

    const container = getContainer();
    const editStockUseCase = container.useCases.investment.editStock;
    
    const result = await editStockUseCase.execute({
      stockToEdit: {
        id: stockId,
        ticker: ticker,
        isAvailable: isAvailable ?? true,
        price: price !== undefined ? Number(price) : undefined,
      }
    });

    if (!result.ok) {
      return res.status(404).json({
        message: result.error.message,
      });
    }

    return res.status(200).json({
      success: true,
    });
  }
);
