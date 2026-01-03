import { and, eq, gt, sql } from "drizzle-orm";
import { StockPriceHistoryRepository } from "../../../application/ports/repositories/StockPriceHistoryRepository";
import { StockPriceHistory } from "../../../domain/entities/StockPriceHistory";
import Result, { err, ok } from "../../../shared/Result";
import { DrizzleClient } from "../../drizzle/client";
import { stockPricesHistory } from "../../drizzle/schema";
import { DrizzleStockPriceHistoryMapper } from "../mappers/DrizzleMappers/DrizzleStockPriceHistoryMapper";

export class StockPriceHistoryRepositoryDrizzle implements StockPriceHistoryRepository {
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
      const thirtyDaysAgoDate = new Date();
      thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);

      const dayGrouping = sql`strftime('%Y-%m-%d', ${stockPricesHistory.recordedAt})`;
      const stockPriceHistoryRows = await this.db.select({
        id: stockPricesHistory.id,
        stockId: stockPricesHistory.stockId,
        price: stockPricesHistory.price,
        // On prend la date la plus récente du groupe (la clôture)
        recordedAt: sql<string>`MAX(${stockPricesHistory.recordedAt})`,
      })
      .from(stockPricesHistory)
      .where(and(
        eq(stockPricesHistory.stockId, stockId),
        gt(stockPricesHistory.recordedAt, thirtyDaysAgoDate.toISOString())
      ))
      .groupBy(dayGrouping);
      const stockPriceHistoriesToDomain = stockPriceHistoryRows.map((row) => {
        return this.stockPriceHistoryMapper.toDomain(row)
      });
      return ok(stockPriceHistoriesToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving stock price histories for stock ${stockId}`))
    }
  }
}