import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const UpdateCompanyController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const container = getContainer();
    const updateCompanyUseCase = container.useCases.investment.updateCompany;
    const result = await updateCompanyUseCase.execute({
      companyId: id,
      name,
      description,
    });

    if (!result.ok) {
      return res.status(400).json({
        message: result.error.message,
      });
    }

    return res.status(200).json({
      company: result.value,
    });
  }
);
