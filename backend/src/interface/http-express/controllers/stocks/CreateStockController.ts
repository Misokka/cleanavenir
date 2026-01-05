import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const CreateStockController = asyncHandler(
  async (req: Request, res: Response) => {
    const { companyId, ticker, price, isAvailable, initialQuantity } = req.body;

    console.log('CreateStockController - Body received:', req.body);

    if (!companyId || !ticker || price === undefined || initialQuantity === undefined) {
      console.log('CreateStockController - Validation failed:', { companyId, ticker, price, initialQuantity });
      return res.status(400).json({
        message: 'Company ID, ticker, price, and initial quantity are required',
      });
    }

    const container = getContainer();
    const createStockUseCase = container.useCases.investment.createStock;
    
    const result = await createStockUseCase.execute({
      companyIdentifier: companyId,
      tickerValue: ticker,
      price: Number(price),
      isAvailable: isAvailable ?? true,
      initialQuantity: Number(initialQuantity),
    });

    if (!result.ok) {
      console.error('CreateStockController - Use case error:', result.error);
      return res.status(400).json({
        message: result.error.message,
      });
    }

    return res.status(201).json({
      stock: result.value,
    });
  }
);
