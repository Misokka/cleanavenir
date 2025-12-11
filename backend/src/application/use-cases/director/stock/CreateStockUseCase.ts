import { randomUUID } from "crypto";
import { Stock } from "../../../../domain/entities/Stock";
import { StockRepository } from "../../../ports/repositories/StockRepository";
import { Ticker } from "../../../../domain/value-objects/Ticker";
import { err } from "../../../../shared/Result";
import { CouldNotCreateStockError } from "../../../../domain/errors/CouldNotCreateStockError";

export class CreateStockUseCase{
  constructor(
    private readonly stockRepository: StockRepository
  ){}

  public async execute(companyIdentifier: string, tickerValue: string, price: number, isAvailable: boolean = true ){
    const ticker = Ticker.from(tickerValue);
    if(!ticker.ok){
      return ticker.error
    }

    const stockIdentifier = randomUUID();
    const newStock = Stock.create({
      stockIdentifier,
      companyIdentifier,
      price,
      ticker: ticker.value,
      isAvailable
    });

    const maybeStock = await this.stockRepository.save(newStock);

    if(!maybeStock.ok){
      return err(new CouldNotCreateStockError())
    }
  }
}