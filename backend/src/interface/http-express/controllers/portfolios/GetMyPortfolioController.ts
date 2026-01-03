import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { toChargedPortfolioDTO } from "../../mappers/dtoMappers";

export const GetMyPortfolioController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const container = getContainer();

    const getMyPortfolioUseCase = container.useCases.investment.getMyPortfolio;

    const portfolioResult = await getMyPortfolioUseCase.execute({ userId });
    if(!portfolioResult.ok){
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: portfolioResult.error.message
      })
    }

    const portfolio = portfolioResult.value;

    return res.status(200).json({
      portfolio: toChargedPortfolioDTO(portfolio)
    })

  }
)