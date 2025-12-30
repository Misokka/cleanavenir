import { eq } from "drizzle-orm";
import { StockPriceRepository } from "../../../application/ports/repositories/StockPriceRepository";
import { StockPriceHistory } from "../../../domain/entities/StockPriceHistory";
import Result, { err, ok } from "../../../shared/Result";
import { DrizzleClient } from "../../drizzle/client";
import { stockPricesHistory } from "../../drizzle/schema";
import { DrizzleStockPriceHistoryMapper } from "../mappers/DrizzleMappers/DrizzleStockPriceHistoryMapper";

export class StockPriceHistoryRepositoryDrizzle implements StockPriceRepository {
  constructor(
    private readonly db: DrizzleClient,
    private readonly stockPriceHistoryMapper: DrizzleStockPriceHistoryMapper,
  ) {}

  async save(stockPriceHistory: StockPriceHistory): Promise<Result<StockPriceHistory, Error>> {
    try{
      const stockPriceHistoryToPersist = this.stockPriceHistoryMapper.toPersistence(stockPriceHistory);
      const savedStockPriceHistory = await this.db.insert(stockPricesHistory).values(stockPriceHistoryToPersist).returning();
      const toDomain = this.stockPriceHistoryMapper.toDomain(savedStockPriceHistory[0]);
      return ok(toDomain);
    } catch (error) {
      return err(new Error(`An error occured when saving stock price history for stock ${stockPriceHistory.stockIdentifier}: ${(error as Error).message}`))
    }
  }

  async all(): Promise<Result<StockPriceHistory[], Error>> {
    try{
      const stockPriceHistoryRows = await this.db.select().from(stockPricesHistory);
      const stockPriceHistoriesToDomain = stockPriceHistoryRows.map((row) => {
        return this.stockPriceHistoryMapper.toDomain(row)
      });
      return ok(stockPriceHistoriesToDomain);
    } catch (error) {
      return err(new Error("An error occured when retrieving all stock price histories"))
    }
  }

  async getByStockId(stockId: string): Promise<Result<StockPriceHistory[], Error>> {
    try{
      const stockPriceHistoryRows = await this.db.select().from(stockPricesHistory).where(eq(stockPricesHistory.stockId, stockId));
      const stockPriceHistoriesToDomain = stockPriceHistoryRows.map((row) => {
        return this.stockPriceHistoryMapper.toDomain(row)
      });
      return ok(stockPriceHistoriesToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving stock price histories for stock ${stockId}`))
    }
  }
}