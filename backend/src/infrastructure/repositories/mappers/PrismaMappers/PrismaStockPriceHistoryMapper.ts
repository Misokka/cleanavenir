import { Mapper } from "../MapperInterface";
import { StockPriceHistory as PrismaStockPriceHistory } from "@prisma/client";
import { StockPriceHistory } from "../../../../domain/entities/StockPriceHistory";

type StockPriceHistoryToPersist = {
  stockPriceIdentifier: string
  stockIdentifier: string
  price: number
  recordedAt: Date
}

export class PrismaStockPriceHistoryMapper implements Mapper<PrismaStockPriceHistory, StockPriceHistory, StockPriceHistoryToPersist> {
  toDomain(raw: PrismaStockPriceHistory): StockPriceHistory {
    return StockPriceHistory.create({
      ...raw
    })
  }

  toPersistence(obj: StockPriceHistory): StockPriceHistoryToPersist {
    return {
      ...obj
    }
  }
}