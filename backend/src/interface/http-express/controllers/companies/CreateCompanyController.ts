import { Request, Response } from 'express';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import { asyncHandler } from '../../middlewares/errorMiddleware';

export const CreateCompanyController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Company name is required',
      });
    }

    const container = getContainer();
    const addCompanyUseCase = container.useCases.investment.addCompany;
    const result = await addCompanyUseCase.execute(name, description || '');

    if (!result.ok) {
      return res.status(400).json({
        message: result.error.message,
      });
    }

    return res.status(201).json({
      company: result.value,
    });
  }
);
