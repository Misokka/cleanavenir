import { PrismaClient } from "@prisma/client";
import { StockPriceHistoryRepository } from "../../../application/ports/repositories/StockPriceHistoryRepository";
import { StockPriceHistory } from "../../../domain/entities/StockPriceHistory";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaStockPriceHistoryMapper } from "../mappers/PrismaMappers/PrismaStockPriceHistoryMapper";

export class PrismaStockPriceHistoryRepository implements StockPriceHistoryRepository{
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaStockPriceHistoryMapper: PrismaStockPriceHistoryMapper
  ){}

  async save(stockPriceHistory: StockPriceHistory): Promise<Result<StockPriceHistory, Error>> {
    try{
      const historyToPersist = this.prismaStockPriceHistoryMapper.toPersistence(stockPriceHistory);
      const saved = await this.prismaClient.stockPriceHistory.create({
        data: historyToPersist
      });
      const toDomain = this.prismaStockPriceHistoryMapper.toDomain(saved);
      return ok(toDomain);
    } catch {
      return err(new Error(`An error occured when saving ${stockPriceHistory.stockPriceIdentifier}`))
    }
  }

  async getByStockId(stockId: string): Promise<Result<StockPriceHistory[], Error>> {
    try{
      const histories = await this.prismaClient.stockPriceHistory.findMany({
        where: {
          stockIdentifier: stockId
        }
      });
      const toDomain = histories.map(history => this.prismaStockPriceHistoryMapper.toDomain(history));
      return ok(toDomain);
    } catch {
      return err(new Error(`An error occured when retrieving price history for stock ${stockId}`))
    }
  }

  async all(): Promise<Result<StockPriceHistory[], Error>> {
    try{
      const histories = await this.prismaClient.stockPriceHistory.findMany();
      const toDomain = histories.map(history => this.prismaStockPriceHistoryMapper.toDomain(history));
      return ok(toDomain);
    } catch {
      return err(new Error(`An error occured when retrieving all price history`))
    }
  }
}