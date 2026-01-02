import { Company } from "../../../../../domain/entities/Company";
import { Holding } from "../../../../../domain/entities/Holding";
import { Portfolio } from "../../../../../domain/entities/Portfolio";
import { Stock } from "../../../../../domain/entities/Stock";
import Result, { err, ok } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { CompanyRepository } from "../../../../ports/repositories/CompanyRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";

export type ChargedPortfolio = Omit<Portfolio, 'addHolding' | 'removeHolding' | 'setHoldings' | 'getHolding' | 'allHoldings' | 'holdings'> & {
  holdingsWithStock: HoldingWithStock[];
}

export type HoldingWithStock = Holding & {
  stockWithCompany: StockWithCompany;
};

export type StockWithCompany =  {
  stock: Stock,
  company: Company
}

export class GetMyPortfolioUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly stockRepository: StockRepository,
    private readonly companyRepository: CompanyRepository,
  ){}

  async execute({ userId }: { userId: string }): Promise<Result<ChargedPortfolio, Error>>{
    const clientResult = await this.clientRepository.findByUserId(userId);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value;

    const portfolioResult = await this.portfolioRepository.findByClientId(client.clientIdentifier);
    if(!portfolioResult.ok) return err(portfolioResult.error);
    const portfolio = portfolioResult.value

    const allStocksResult = await this.stockRepository.all();
    if(!allStocksResult.ok) return err(allStocksResult.error);
    const allStocks = allStocksResult.value;

    const allCompaniesResult = await this.companyRepository.all();
    if(!allCompaniesResult.ok) return err(allCompaniesResult.error);
    const allCompanies = allCompaniesResult.value;


    const holdingsWithStock = portfolio.allHoldings().map((holding) => {
      const stock = allStocks.find(st => st.stockIdentifier === holding.stockIdentifier) as Stock;
      const stockCompany = allCompanies.find(cmp => cmp.companyIdentifier === stock.companyIdentifier) as Company;

      const stockWithCompany: StockWithCompany = {
        stock,
        company: stockCompany
        
      } 
      const holdingWithStock: HoldingWithStock = {
        ...holding,
        stockWithCompany
      }

      return holdingWithStock;
    });

    const chargedPortfolio: ChargedPortfolio = {
      ...portfolio,
      holdingsWithStock
    } 

    return ok(chargedPortfolio);
  }
}