import { Mapper } from "../MapperInterface";
import { $Enums, Trade as PrismaTrade } from "@prisma/client";
import { Trade } from "../../../../domain/entities/Trade";

type TradeToPersist = {
  tradeIdentifier: string,
  stockIdentifier: string,
  buyOrderIdentifier: string,
  sellOrderIdentifier: string,
  quantity: number,
  price: number, 
  timestamp?: Date,
}

export class PrismaTradeMapper implements Mapper<PrismaTrade, Trade, TradeToPersist>{
  toDomain(raw: PrismaTrade): Trade {
    return new Trade(
      raw.tradeIdentifier,
      raw.stockIdentifier,
      raw.buyOrderIdentifier,
      raw.sellOrderIdentifier,
      raw.quantity,
      raw.price,
      raw.timestamp
    )
  }

  toPersistence(obj: Trade): TradeToPersist {
    return {...obj}
  }
}