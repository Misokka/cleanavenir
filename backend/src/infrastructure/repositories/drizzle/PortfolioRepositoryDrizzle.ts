import { eq } from 'drizzle-orm';
import { portfolios } from '../../drizzle/schema';
import { err, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { PortfolioRepository } from '../../../application/ports/repositories/PortfolioRepository';
import { DrizzlePortfolioMapper } from '../mappers/DrizzleMappers/DrizzlePortfolioMapper';
import { Portfolio } from '../../../domain/entities/Portfolio';
import { PortfolioNotFoundError } from '../../../domain/errors/PortfolioNotFoundError';

export class PortfolioRepositoryDrizzle implements PortfolioRepository {
  constructor(
    private db: DrizzleClient,
    private readonly portfolioMapper: DrizzlePortfolioMapper
  ) {}

  async save(portfolio: Portfolio): Promise<Result<Portfolio, Error>> {
    try {
      const portfolioToPersist = this.portfolioMapper.toPersistence(portfolio)
      const registeredPortofolioRows = await this.db.insert(portfolios).values(portfolioToPersist).returning();
      const portfolioToDomain = this.portfolioMapper.toDomain(registeredPortofolioRows[0]);
      return Result.ok(portfolioToDomain);
    } catch (e: any) {
      return Result.err(new Error(`Could not insert portfolio: ${e.message}`));
    }
  }

  async findByClientId(clientIdentifier: string): Promise<Result<Portfolio, PortfolioNotFoundError>> {
    try {
      const rows = await this.db.select().from(portfolios).where(eq(portfolios.ownerId, clientIdentifier));
      if(!rows.length){
        return err(new PortfolioNotFoundError(`Portfolio not found for client with id: ${clientIdentifier}`))
      }

      const portfolioToDomain = this.portfolioMapper.toDomain(rows[0]);
      return Result.ok(portfolioToDomain);
    } catch (e: any) {
      return Result.err(new Error(`Could not list portfolios: ${e.message}`));
    }
  }
}
