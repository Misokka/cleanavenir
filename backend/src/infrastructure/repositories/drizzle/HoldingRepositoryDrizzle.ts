import { eq } from 'drizzle-orm';
import { holdings } from '../../drizzle/schema';
import { err, ok, Result } from '../../../shared/Result';
import { HoldingRepository } from '../../../application/ports/repositories/HoldingRepository';
import { Holding } from '../../../domain/entities/Holding';
import { HoldingNotFoundError } from '../../../domain/errors/HoldingNotFoundError';
import { DrizzleClient } from '../../drizzle/client';

export class HoldingRepositoryDrizzle implements HoldingRepository {
  constructor(private db: DrizzleClient) {}

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

  async findById(holdingIdentifier: string): Promise<Result<Holding, HoldingNotFoundError>> {
    try {
      const row = await this.db
        .select()
        .from(holdings)
        .where(eq(holdings.id, holdingIdentifier))
        .limit(1);
      return Result.ok(row?.[0] ?? null);
    } catch (e: any) {
      return Result.err(new Error(`Could not find holding: ${e.message}`));
    }
  }

  async listByUserPortfolio(portfolioIdentifier: string): Promise<Result<Map<string, Holding>, never>> {
    const rows = await this.db
      .select()
      .from(holdings)
      .where(eq(holdings.id, portfolioIdentifier));
    const holdingsMap = new Map<string, Holding>();
    rows.forEach((holding: Holding) => {
      holdingsMap.set(holding.stockIdentifier, holding);
    });
    return ok(holdingsMap);
    
  }

  async update(holdingIdentifier: string, quantity: number): Promise<Result<Holding, HoldingNotFoundError | Error>> {
    try {
      const now = new Date().toISOString();
      await this.db.update(holdings)
        .set({
          quantity,
          updatedAt: now,
        })
        .where(eq(holdings.id, holdingIdentifier));
      const row = await this.db
        .select()
        .from(holdings)
        .where(eq(holdings.id, holdingIdentifier))
        .limit(1);
      return ok(row[0]);
    } catch (e: any) {
      return err(new Error(`Could not update holding: ${e.message}`));
    }
  }

  async delete(holdingIdentifier: string): Promise<Result<void, HoldingNotFoundError>> {
   try {
      await this.db.delete(holdings).where(eq(holdings.id, holdingIdentifier));
      return ok(undefined);
    } catch (e: any) {
      return err(new HoldingNotFoundError(holdingIdentifier));
    }
  }
}
