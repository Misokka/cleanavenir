import { eq } from 'drizzle-orm';
import { holdings } from '../../drizzle/schema';
import { Result } from '../../../shared/Result';

export class HoldingRepositoryDrizzle {
  constructor(private db: any) {}

  async save(holding: any) {
    try {
      await this.db.insert(holdings).values(holding);
      return Result.ok(holding);
    } catch (e: any) {
      return Result.err(new Error(`Could not insert holding: ${e.message}`));
    }
  }

  async findByOwnerAndStock(ownerId: string, stockId: string) {
    try {
      const row = await this.db
        .select()
        .from(holdings)
        .where(eq(holdings.ownerId, ownerId))
        .where(eq(holdings.stockId, stockId))
        .limit(1);
      return Result.ok(row?.[0] ?? null);
    } catch (e: any) {
      return Result.err(new Error(`Could not find holding: ${e.message}`));
    }
  }
}
