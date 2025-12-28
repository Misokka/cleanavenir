
import { Stock } from "../../../../domain/entities/Stock";
import Result, { err, ok } from "../../../../shared/Result";
import { StockRepository } from "../../../ports/repositories/StockRepository";

export class ListStocksUseCase{
  constructor(
    private readonly stockRepository: StockRepository
  ){}

  async execute(): Promise<Result<Stock[], Error>>{
    const stockResult = await this.stockRepository.all();
    if(!stockResult.ok){
      return err(stockResult.error);
    }

    return ok(stockResult.value);
  }
}