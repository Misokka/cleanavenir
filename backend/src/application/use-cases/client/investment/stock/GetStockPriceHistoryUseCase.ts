
import { Stock } from "../../../../../domain/entities/Stock";
import { StockPriceHistory } from "../../../../../domain/entities/StockPriceHistory";
import Result, { err, ok } from "../../../../../shared/Result";
import { StockPriceHistoryRepository } from "../../../../ports/repositories/StockPriceHistoryRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";

type stockHistoryType = {
  stock: Stock;
  stockPriceHistory: StockPriceHistory[]
}

export class GetStockPriceHistoryUseCase {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly stockPriceHistoryRepository: StockPriceHistoryRepository
  ){}

  async execute({ stockId }: { stockId: string}): Promise<Result<stockHistoryType, Error>>{
    const stockResult = await this.stockRepository.findById(stockId);
    if(!stockResult.ok) return err(stockResult.error);
    const stock = stockResult.value;

    const stockPriceHistoryResult = await this.stockPriceHistoryRepository.getByStockId(stockId);
    if(!stockPriceHistoryResult.ok) return err(stockPriceHistoryResult.error);
    const priceHistory = stockPriceHistoryResult.value;

    const stockPriceHistory: stockHistoryType = {
      stock,
      stockPriceHistory: priceHistory
    }

    return ok(stockPriceHistory);
  }
}