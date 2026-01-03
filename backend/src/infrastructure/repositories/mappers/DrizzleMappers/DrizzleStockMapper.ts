import { Stock } from "../../../../domain/entities/Stock";
import { Ticker } from "../../../../domain/value-objects/Ticker";
import { StockDrizzle, NewStockDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleStockMapper implements Mapper<StockDrizzle, Stock, NewStockDrizzle> {
  toDomain(raw: StockDrizzle): Stock {
    const tickerResult = Ticker.from(raw.ticker);
    if(!tickerResult.ok){
      throw new Error("Invalid ticker fomat");
    }

    return Stock.create({
      ...raw,
      stockIdentifier: raw.id,
      companyIdentifier: raw.companyId,
      ticker: tickerResult.value,
      isAvailable: raw.isAvailable === 1 ? true : false,
      createdAt: new Date(raw.createdAt)
    });
  }

  toPersistence(entity: Stock): NewStockDrizzle {
    // ...mapping logic...
    return {
      ...entity,
      id: entity.stockIdentifier,
      companyId: entity.companyIdentifier,
      ticker: entity.ticker.value,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString() as string,
      isAvailable: entity.isAvailable ? 1 : 0
    };
  }
}
