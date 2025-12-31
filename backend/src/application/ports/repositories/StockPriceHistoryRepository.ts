import { StockPriceHistory } from "../../../domain/entities/StockPriceHistory";
import Result from "../../../shared/Result";

export interface StockPriceHistoryRepository {
  save(stockPriceHistory: StockPriceHistory): Promise<Result<StockPriceHistory, Error>>;
  all(): Promise<Result<StockPriceHistory[], Error>>;
  getByStockId(stockId: string): Promise<Result<StockPriceHistory[], Error>>;
}