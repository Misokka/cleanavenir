import { randomUUID } from "crypto";
import { Stock } from "../../../../domain/entities/Stock";
import { StockRepository } from "../../../ports/repositories/StockRepository";
import { Ticker } from "../../../../domain/value-objects/Ticker";
import Result, { err, ok } from "../../../../shared/Result";
import { CouldNotCreateStockError } from "../../../../domain/errors/CouldNotCreateStockError";

export class CreateStockUseCase{
  constructor(
    private readonly stockRepository: StockRepository
  ){}

  public async execute(companyIdentifier: string, tickerValue: string, price: number, isAvailable: boolean = true ): Promise<Result<Stock, Error>>{
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