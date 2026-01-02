import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/errorMiddleware";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";

export const CreatePortfolioController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const container = getContainer();

    const createPortfolioUseCase = container.useCases.investment.createPortfolio;
    
    const portfolioResult = await createPortfolioUseCase.execute({userId});
    if(!portfolioResult.ok){
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: portfolioResult.error.message
      })
    }

    return res.status(200).json({
      success: true,
      message: "Portfolio créé avec succès"
    })
  }
)