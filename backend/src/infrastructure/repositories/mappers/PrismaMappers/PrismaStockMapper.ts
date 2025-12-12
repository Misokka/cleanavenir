import { Mapper } from "../MapperInterface";
import { Stock as PrismaStock } from "@prisma/client";
import { Stock } from "../../../../domain/entities/Stock";
import { Ticker } from "../../../../domain/value-objects/Ticker";

type StockToPersist = {
  stockIdentifier: string;
  companyIdentifier: string;
  ticker: string;
  price: number;
  isAvailable: boolean;
}

export class PrismaStockMapper implements Mapper<PrismaStock, Stock, StockToPersist> {
  toDomain(raw: PrismaStock): Stock {
    return Stock.create({
      ...raw,
      ticker: new Ticker(raw.ticker)
    })
  }

  toPersistence(obj: Stock): StockToPersist {
    return {...obj, ticker: obj.ticker.value}
  }
}