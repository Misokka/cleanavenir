import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const DeleteCompanyController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const container = getContainer();
    const deleteCompanyUseCase = container.useCases.investment.deleteCompany;
    const result = await deleteCompanyUseCase.execute(id);

    if (!result.ok) {
      return res.status(400).json({
        message: result.error.message,
      });
    }

    return res.status(200).json({
      message: 'Company and associated stocks deleted successfully',
    });
  }
);
