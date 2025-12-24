import { randomUUID } from "crypto";
import { Stock } from "../../../../domain/entities/Stock";
import { StockRepository } from "../../../ports/repositories/StockRepository";
import { Ticker } from "../../../../domain/value-objects/Ticker";
import Result, { err, ok } from "../../../../shared/Result";
import { CouldNotCreateStockError } from "../../../../domain/errors/CouldNotCreateStockError";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";

type CreateStockProps = {
  companyIdentifier: string,
  tickerValue: string,
  price: number,
  isAvailable: boolean
}
export class CreateStockUseCase{
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly companyRepository: CompanyRepository
  ){}

  public async execute({companyIdentifier, tickerValue, price, isAvailable}: CreateStockProps): Promise<Result<Stock, Error>>{
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
      return err(new CouldNotCreateStockError())
    }

    return ok(maybeStock.value)
  }
}