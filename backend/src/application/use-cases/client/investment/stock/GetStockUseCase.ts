import { Company } from "../../../../../domain/entities/Company";
import { Stock } from "../../../../../domain/entities/Stock";
import Result, { err, ok } from "../../../../../shared/Result";
import { CompanyRepository } from "../../../../ports/repositories/CompanyRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";

export type StockWithCompanyType = {
  stock: Stock;
  company: Company
}

export class GetStockUseCase {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly companyRepository: CompanyRepository,
  ){}

  async execute({stockId}: {stockId: string}): Promise<Result<StockWithCompanyType, Error>>{
    const stockResult = await this.stockRepository.findById(stockId);
    if(!stockResult.ok) return err(stockResult.error);
    const stock = stockResult.value;

    const companyResult = await this.companyRepository.findById(stock.companyIdentifier);
    if(!companyResult.ok) return err(companyResult.error);
    const company = companyResult.value;

    const stockWithCompany: StockWithCompanyType = {
      stock,
      company
    }

    return ok(stockWithCompany);
  }
}