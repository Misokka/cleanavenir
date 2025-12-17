import { eq } from 'drizzle-orm';
import { holdings } from '../../drizzle/schema';
import { err, ok, Result } from '../../../shared/Result';
import { HoldingRepository } from '../../../application/ports/repositories/HoldingRepository';
import { Holding } from '../../../domain/entities/Holding';
import { HoldingNotFoundError } from '../../../domain/errors/HoldingNotFoundError';
import { DrizzleClient } from '../../drizzle/client';
import { DrizzleHoldingMapper } from '../mappers/DrizzleMappers/DrizzleHoldingMapper';

export class HoldingRepositoryDrizzle implements HoldingRepository {
  constructor(
    private db: DrizzleClient,
    private readonly holdingMapper: DrizzleHoldingMapper
  ) {}

  async save(holding: Holding): Promise<Result<Holding, Error>> {
    try {
      const holdingToPersist = this.holdingMapper.toPersistence(holding)
      const registeredHoldings = await this.db.insert(holdings).values(holdingToPersist).returning();
      const holdingToDomain = this.holdingMapper.toDomain(registeredHoldings[0])
      return Result.ok(holdingToDomain);
    } catch (e: any) {
      return Result.err(new Error(`Could not insert holding: ${e.message}`));
    }
  }


  async findById(holdingIdentifier: string): Promise<Result<Holding, HoldingNotFoundError>> {
    try {
      const rows = await this.db
        .select()
        .from(holdings)
        .where(eq(holdings.id, holdingIdentifier))
        .limit(1);

      const holdingToDomain = this.holdingMapper.toDomain(rows[0])
      return Result.ok(holdingToDomain);
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

    rows.forEach((row) => {
      const holding = this.holdingMapper.toDomain(row)
      holdingsMap.set(holding.stockIdentifier, holding);
    });
    return ok(holdingsMap);
    
  }

  async update(holdingIdentifier: string, quantity: number): Promise<Result<Holding, HoldingNotFoundError | Error>> {
    try {
      const now = new Date().toISOString();
      const updatedHoldings = await this.db.update(holdings)
        .set({
          quantity,
          updatedAt: now,
        })
        .where(eq(holdings.id, holdingIdentifier)).returning();

      const updatedToDomain = this.holdingMapper.toDomain(updatedHoldings[0])
      
      return ok(updatedToDomain);
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
