import { eq } from 'drizzle-orm';
import { portfolios } from '../../drizzle/schema';
import { Result } from '../../../shared/Result';

export class PortfolioRepositoryDrizzle {
  constructor(private db: any) {}

  async save(portfolio: any) {
    try {
      await this.db.insert(portfolios).values(portfolio);
      return Result.ok(portfolio);
    } catch (e: any) {
      return Result.err(new Error(`Could not insert portfolio: ${e.message}`));
    }
  }

  async findByOwner(ownerId: string) {
    try {
      const rows = await this.db.select().from(portfolios).where(eq(portfolios.ownerId, ownerId));
      return Result.ok(rows);
    } catch (e: any) {
      return Result.err(new Error(`Could not list portfolios: ${e.message}`));
    }
  }
}
