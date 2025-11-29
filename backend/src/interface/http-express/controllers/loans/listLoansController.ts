import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const listLoansController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;

    const container = getContainer();
    const loanRepository = container.repositories.loan;

    const result = await loanRepository.findAllByUserId(userId);

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    res.json({ loans: result.value });
  }
);
