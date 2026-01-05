import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const DeleteStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const { stockId } = req.params;

    const container = getContainer();
    const stockRepository = container.repositories.stock;
    
    const result = await stockRepository.remove(stockId);

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
