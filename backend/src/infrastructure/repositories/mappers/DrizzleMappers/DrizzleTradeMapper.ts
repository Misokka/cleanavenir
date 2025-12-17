import { Trade, TradeStatus } from "../../../../domain/entities/Trade";
import { TradeDrizzle, NewTradeDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleTradeMapper implements Mapper<TradeDrizzle, Trade, NewTradeDrizzle> {
  toDomain(raw: TradeDrizzle): Trade {
    
    return Trade.create({
      ...raw,
      tradeIdentifier: raw.id,
      stockIdentifier: raw.stockId,
      status: raw.status as TradeStatus,
      buyOrderIdentifier: raw.buyOrderId,
      sellOrderIdentifier: raw.sellOrderId,
      createdAt: new Date(raw.createdAt)
    }) ;
  }

  toPersistence(entity: Trade): NewTradeDrizzle {
    
    return {
      ...entity,
      id: entity.tradeIdentifier,
      stockId: entity.stockIdentifier,
      buyOrderId: entity.buyOrderIdentifier,
      sellOrderId: entity.sellOrderIdentifier,
      createdAt: entity.createdAt.toISOString(),
    }
  }
}
