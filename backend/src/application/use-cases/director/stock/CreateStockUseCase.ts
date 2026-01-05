import { randomUUID } from "crypto";
import { Stock } from "../../../../domain/entities/Stock";
import { StockRepository } from "../../../ports/repositories/StockRepository";
import { Ticker } from "../../../../domain/value-objects/Ticker";
import Result, { err, ok } from "../../../../shared/Result";
import { CouldNotCreateStockError } from "../../../../domain/errors/CouldNotCreateStockError";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import { PortfolioRepository } from "../../../ports/repositories/PortfolioRepository";
import { Portfolio } from "../../../../domain/entities/Portfolio";
import { SYSTEM_PORTFOLIO_ID } from "../../../../shared/constants/Investment";

type CreateStockProps = {
  companyIdentifier: string,
  tickerValue: string,
  price: number,
  isAvailable: boolean,
  initialQuantity: number
}
export class CreateStockUseCase{
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly portfolioRepository: PortfolioRepository
  ){}

  public async execute({companyIdentifier, tickerValue, price, isAvailable, initialQuantity}: CreateStockProps): Promise<Result<Stock, Error>>{
    const existingCompanyResult = await this.companyRepository.findById(companyIdentifier);

    if(!existingCompanyResult.ok){
      return err(existingCompanyResult.error)
    }

    // vérifier si l'entreprise n'a pas déja d'action en circulation

    const ticker = Ticker.from(tickerValue);
    if(!ticker.ok){
      return err(ticker.error)
    }

    const stockIdentifier = randomUUID();
    const newStock = Stock.create({
      stockIdentifier,
      companyIdentifier,
      price,
      ticker: ticker.value,
      isAvailable,
      createdAt: new Date()
    });

    const maybeStock = await this.stockRepository.save(newStock);

    if(!maybeStock.ok){
      console.error('CreateStockUseCase - Stock save error:', maybeStock.error);
      return err(new CouldNotCreateStockError())
    }

    // Note: Les holdings initiaux peuvent être gérés par un système de matching d'ordres
    // Pour l'instant, on ne crée pas de portfolio système automatiquement
    // car cela nécessiterait un utilisateur système dans la table clients

    return ok(maybeStock.value)
  }
}