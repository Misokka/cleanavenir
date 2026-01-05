import { eq } from 'drizzle-orm';
import { stocks, holdings, orders, trades, stockPricesHistory } from '../../drizzle/schema';
import Result, { ok, err } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { StockRepository } from '../../../application/ports/repositories/StockRepository';
import { DrizzleStockMapper } from '../mappers/DrizzleMappers/DrizzleStockMapper';
import { Stock } from '../../../domain/entities/Stock';
import { StockNotFoundError } from '../../../domain/errors/StockNotFoundError';

export class StockRepositoryDrizzle implements StockRepository {
  constructor(
    private db: DrizzleClient,
    private readonly stockMapper: DrizzleStockMapper
  ) {}

  async save(stock: Stock): Promise<Result<Stock, Error>> {
    try{
      const stockToPersist = this.stockMapper.toPersistence(stock);
      console.log('StockRepositoryDrizzle - Persisting:', stockToPersist);
      const registeredStockRows = await this.db.insert(stocks).values(stockToPersist).returning();
      const stockToDomain = this.stockMapper.toDomain(registeredStockRows[0]);
      return ok(stockToDomain);
    } catch (error) {
      console.error('StockRepositoryDrizzle - Save error:', error);
      return err(new Error(`An error occured when saving stock: ${stock.stockIdentifier} - ${(error as Error).message}`));
    }
  }

  async findById(stockIdentifier: string): Promise<Result<Stock, StockNotFoundError>> {
    try{
      const stockRows = await this.db.select().from(stocks).where(eq(stocks.id, stockIdentifier)).limit(1);
      if(!stockRows.length){
        return err(new StockNotFoundError(stockIdentifier))
      }
      const stockToDomain = this.stockMapper.toDomain(stockRows[0]);
      return ok(stockToDomain);
    } catch {
      return err(new Error(`An error occured retrieving stock: ${stockIdentifier}`));
    }
  }

  async findByTicker(ticker: string): Promise<Result<Stock, StockNotFoundError>> {
    try{
      const stockRows = await this.db.select().from(stocks).where(eq(stocks.ticker, ticker)).limit(1);
      if(!stockRows.length){
        return err(new StockNotFoundError(ticker))
      }
      const stockToDomain = this.stockMapper.toDomain(stockRows[0]);
      return ok(stockToDomain);
    } catch {
      return err(new Error(`An error occured retrieving stock with ticker: ${ticker}`));
    }
  }

  async findByCompanyId(companyId: string): Promise<Result<Stock[], Error>> {
    try {
      const stockRows = await this.db.select().from(stocks).where(eq(stocks.companyId, companyId));
      const stocksToDomain = stockRows.map(row => this.stockMapper.toDomain(row));
      return ok(stocksToDomain);
    } catch (e: any) {
      return err(new Error(`An error occurred retrieving stocks for company: ${companyId}`));
    }
  }

  async all(): Promise<Result<Stock[], Error>> {
    try{
      const stockRows = await this.db.select().from(stocks);
      const stocksToDomain = stockRows.map((row) => {
        return this.stockMapper.toDomain(row);
      });
      return ok(stocksToDomain);
    } catch {
      return err(new Error(`An error occured retrieving stocks.`));
    }
  }

  // récupérer les action dispo
  async allAvailableStocks() : Promise<Result<Stock[], Error>>{
    try{
      const stockRows = await this.db.select().from(stocks).where(eq(stocks.isAvailable, 1));
      const stocksToDomain = stockRows.map((row) => {
        return this.stockMapper.toDomain(row);
      });
      return ok(stocksToDomain);
    } catch {
      return err(new Error(`An error occured retrieving stocks.`));
    }
  }

  async update(stock: Stock): Promise<Result<Stock, StockNotFoundError>> {
    try{
      const stockToPersist = this.stockMapper.toPersistence(stock);
      const updatedStockRows = await this.db.update(stocks).set(stockToPersist).where(eq(stocks.id, stock.stockIdentifier)).returning();
      const stockToDomain = this.stockMapper.toDomain(updatedStockRows[0]);
      return ok(stockToDomain);
    } catch {
      return err(new Error(`An error occured updating stock: ${stock.stockIdentifier}.`));
    }
  }

  async remove(stockIdentifier: string): Promise<Result<true, StockNotFoundError>> {
    try{
      // Vérifier que le stock existe
      const stockRows = await this.db.select().from(stocks).where(eq(stocks.id, stockIdentifier)).limit(1);
      if(!stockRows.length){
        return err(new StockNotFoundError(stockIdentifier));
      }

      // Supprimer en cascade toutes les dépendances
      // 1. Holdings
      await this.db.delete(holdings).where(eq(holdings.stockId, stockIdentifier));
      
      // 2. Orders
      await this.db.delete(orders).where(eq(orders.stockId, stockIdentifier));
      
      // 3. Trades
      await this.db.delete(trades).where(eq(trades.stockId, stockIdentifier));
      
      // 4. Stock price history
      await this.db.delete(stockPricesHistory).where(eq(stockPricesHistory.stockId, stockIdentifier));

      // 5. Supprimer le stock
      const deletedStockRows = await this.db.delete(stocks).where(eq(stocks.id, stockIdentifier)).returning();
      if(!deletedStockRows.length){
        return err(new StockNotFoundError(stockIdentifier));
      }

      return ok(true);
    } catch (e: any) {
      console.error('Error deleting stock:', e);
      return err(new Error(`An error occured deleting stock: ${stockIdentifier}. ${e.message}`));
    }
  }


}
