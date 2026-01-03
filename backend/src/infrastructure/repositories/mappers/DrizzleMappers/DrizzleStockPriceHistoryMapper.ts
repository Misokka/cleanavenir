import { StockPriceHistory } from "../../../../domain/entities/StockPriceHistory";
import { NewStockPriceHistoryDrizzle, StockPriceHistoryDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleStockPriceHistoryMapper implements Mapper<StockPriceHistoryDrizzle, StockPriceHistory, NewStockPriceHistoryDrizzle>{
  toDomain(raw: StockPriceHistoryDrizzle): StockPriceHistory {
    return StockPriceHistory.create({
      ...raw,
      stockPriceIdentifier: raw.id,
      stockIdentifier: raw.stockId,
      recordedAt: new Date(raw.recordedAt),
    });
  }

  toPersistence(obj: StockPriceHistory): NewStockPriceHistoryDrizzle {
    return {
      ...obj,
      id: obj.stockPriceIdentifier,
      stockId: obj.stockIdentifier,
      recordedAt: obj.recordedAt.toISOString(),
    }
  }
}