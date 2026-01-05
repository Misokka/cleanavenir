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
      stockIdentifier: raw.stockIdentifier,
      companyIdentifier: raw.companyIdentifier,
      ticker: new Ticker(raw.ticker),
      price: raw.price,
      isAvailable: raw.isAvailable,
      createdAt: new Date() // Prisma schema n'a pas createdAt, on utilise Date actuelle
    })
  }

  toPersistence(obj: Stock): StockToPersist {
    return {
      stockIdentifier: obj.stockIdentifier,
      companyIdentifier: obj.companyIdentifier,
      ticker: obj.ticker.value,
      price: obj.price,
      isAvailable: obj.isAvailable
    }
  }
}