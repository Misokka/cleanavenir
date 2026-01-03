import { Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toCompanyDTO } from "../../mappers/dtoMappers";

export const ListCompaniesController = asyncHandler(
  async(_, res: Response) => {
    const container = getContainer();
    const listCompaniesUseCase = container.useCases.investment.listCompanies;

    const result = await listCompaniesUseCase.execute();

    if(!result.ok){
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: result.error.message
       });
    }

    return res.status(200).json({
      companies: result.value.map(toCompanyDTO)
    });
  }
)