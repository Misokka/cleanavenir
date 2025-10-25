import { eq } from 'drizzle-orm';
import { stocks } from '../../drizzle/schema';
import { ok, err } from '../../../shared/Result';

export class StockRepositoryDrizzle {
  constructor(private db: any) {}

  async save(stock: any) {
    try {
      await this.db.insert(stocks).values(stock);
      return ok(stock);
    } catch (e: any) {
      return err(new Error(`Could not insert stock: ${e.message}`));
    }
  }

  async findBySymbol(symbol: string) {
    try {
      const row = await this.db.select().from(stocks).where(eq(stocks.symbol, symbol)).limit(1);
      return ok(row?.[0] ?? null);
    } catch (e: any) {
      return err(new Error(`Could not find stock by symbol: ${e.message}`));
    }
  }

  async listAll() {
    try {
      const rows = await this.db.select().from(stocks);
      return ok(rows);
    } catch (e: any) {
      return err(new Error(`Could not list stocks: ${e.message}`));
    }
  }
}
