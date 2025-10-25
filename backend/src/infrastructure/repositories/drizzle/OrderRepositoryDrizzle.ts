import { eq } from 'drizzle-orm';
import { orders } from '../../drizzle/schema';
import { ok, err } from '../../../shared/Result';

export class OrderRepositoryDrizzle {
  constructor(private db: any) {}

  async save(order: any) {
    try {
      await this.db.insert(orders).values(order);
      return ok(order);
    } catch (e: any) {
      return err(new Error(`Could not insert order: ${e.message}`));
    }
  }

  async findById(id: string) {
    try {
      const row = await this.db.select().from(orders).where(eq(orders.id, id)).limit(1);
      return ok(row?.[0] ?? null);
    } catch (e: any) {
      return err(new Error(`Could not find order by id: ${e.message}`));
    }
  }

  async listOpenForStock(stockId: string) {
    try {
      const rows = await this.db.select().from(orders).where(eq(orders.stockId, stockId));
      return ok(rows);
    } catch (e: any) {
      return err(new Error(`Could not list orders: ${e.message}`));
    }
  }
}
