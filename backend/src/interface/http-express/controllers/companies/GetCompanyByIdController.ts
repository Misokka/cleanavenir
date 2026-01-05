import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const GetCompanyByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const container = getContainer();
    const getCompanyByIdUseCase = container.useCases.investment.getCompanyById;
    const result = await getCompanyByIdUseCase.execute(id);

    if (!result.ok) {
      return res.status(404).json({
        message: result.error.message,
      });
    }

    return res.status(200).json({
      company: result.value,
    });
  }
);
