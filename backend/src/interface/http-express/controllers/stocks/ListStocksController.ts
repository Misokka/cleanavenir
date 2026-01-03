import { asyncHandler } from "../../middlewares/errorMiddleware";
import { Request, Response } from "express";
import { getContainer } from "../../../../infrastructure/bootstrap/instance";
import { Company } from "../../../../domain/entities/Company";
import { Stock } from "../../../../domain/entities/Stock";
import { toStockDTO } from "../../mappers/dtoMappers";
import { StockDTO } from "../../../../application/dtos/StockDTO";

export const ListStocksController = asyncHandler(
  async(req: Request, res: Response) => {
    const user = req.user;
    const container = getContainer();

    const listStocksUseCase = container.useCases.investment.listStocks;
    
    const stockType = user?.role === "DIRECTOR" ? "ALL" : "AVAILABLE_ONLY"
    const result = await listStocksUseCase.execute({stockType});
    if(!result.ok){
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: result.error.message 
      });
    }

    const stocks = result.value;

    const listCompaniesUseCase = container.useCases.investment.listCompanies;
    const companiesResult = await listCompaniesUseCase.execute();
    if(!companiesResult.ok){
      return res.status(500).json({
        error: "INTERNAL_ERROR",
        message: companiesResult.error.message 
      });
    };

    const companies = companiesResult.value;
    const stockDTOs: StockDTO[] = [];

    stocks.forEach((stock) => {
      const company = companies.find(c => c.companyIdentifier === stock.companyIdentifier);
      if(!company){
        return res.status(500).json({
          error: "INTERNAL_ERROR",
          message: `Company with id ${stock.companyIdentifier} not found for stock ${stock.ticker.value}`
        });
      }

      const stockDTO = toStockDTO(stock, company);
      stockDTOs.push(stockDTO);
    })

    return res.status(200).json({ stocks: stockDTOs });
  }
)