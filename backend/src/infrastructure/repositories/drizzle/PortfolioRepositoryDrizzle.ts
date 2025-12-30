import { and, eq, notInArray } from 'drizzle-orm';
import { holdings, portfolios } from '../../drizzle/schema';
import { err, ok, Result } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { PortfolioRepository } from '../../../application/ports/repositories/PortfolioRepository';
import { DrizzlePortfolioMapper } from '../mappers/DrizzleMappers/DrizzlePortfolioMapper';
import { Portfolio } from '../../../domain/entities/Portfolio';
import { PortfolioNotFoundError } from '../../../domain/errors/PortfolioNotFoundError';
import { DrizzleHoldingMapper } from '../mappers/DrizzleMappers/DrizzleHoldingMapper';
import { Holding } from '../../../domain/entities/Holding';

export class PortfolioRepositoryDrizzle implements PortfolioRepository {
  constructor(
    private db: DrizzleClient,
    private readonly portfolioMapper: DrizzlePortfolioMapper,
    private readonly holdingMapper: DrizzleHoldingMapper,
  ) {}

  async save(portfolio: Portfolio): Promise<Result<Portfolio, Error>> {
    try {
      const portfolioToPersist = this.portfolioMapper.toPersistence(portfolio)
      const registeredPortofolioRows = await this.db.insert(portfolios).values(portfolioToPersist).returning();

      const holdingsToPersist = portfolio.allHoldings();
      const holdingsToPortfolio: Holding[] = []; 
      if(holdingsToPersist.length){
        for(const holding of holdingsToPersist){
          const holdingToPersist = this.holdingMapper.toPersistence(holding);
          const inserted = await this.db.insert(holdings).values(holdingToPersist).returning();
          holdingsToPortfolio.push(this.holdingMapper.toDomain(inserted[0]));
        }
      }
      const portfolioToDomain = this.portfolioMapper.toDomain(registeredPortofolioRows[0]);
      
      if(holdingsToPortfolio.length){
        portfolioToDomain.setHoldings(holdingsToPortfolio);
      }
    
      return ok(portfolioToDomain);
    } catch (e: any) {
      return err(new Error(`Could not insert portfolio: ${e.message}`));
    }
  }

  async update(portfolio: Portfolio): Promise<Result<Portfolio, Error>> {
    try{
      const portfolioToPersist = this.portfolioMapper.toPersistence(portfolio);
      const currentHoldings = portfolio.allHoldings();
      const currentHoldingIds = currentHoldings.map(h => h.holdingIdentifier);

      // maj portfolio
      const updatedPortfolioRows = await this.db.update(portfolios).set(portfolioToPersist).where(eq(portfolios.id, portfolio.portfolioIdentifier)).returning();
      const portfolioToDomain = this.portfolioMapper.toDomain(updatedPortfolioRows[0]);

      if(currentHoldings.length){
          // delete holdings that aren't in the portfolio's holding map anymore but still in DB
          await this.db.delete(holdings).where(and(
            eq(holdings.portfolioId, portfolio.portfolioIdentifier),
            notInArray(holdings.id, currentHoldingIds)
          ));
        } else {
          // si le portfolio est vide/ n'a plus de holdings
          await this.db.delete(holdings).where(eq(holdings.portfolioId, portfolio.portfolioIdentifier));
        }

      for(const holding of currentHoldings){
        const holdingToPersist = this.holdingMapper.toPersistence(holding);
        await this.db.insert(holdings).values(holdingToPersist).onConflictDoUpdate({
          target: holdings.id,
          set: holdingToPersist
        });
      }

    
      const portfolioHoldingsRows = await this.db.select().from(holdings).where(eq(holdings.portfolioId, portfolio.portfolioIdentifier));
      const holdingsToDomain = portfolioHoldingsRows.map((row) => this.holdingMapper.toDomain(row));
      portfolioToDomain.setHoldings(holdingsToDomain);

      return ok(portfolioToDomain);
    } catch (error) {
      return err(new Error(`Could not update portfolio ${portfolio.portfolioIdentifier}: ${(error as Error).message}`));
    }
  }

  async findByClientId(clientIdentifier: string): Promise<Result<Portfolio, PortfolioNotFoundError>> {
    try {
      const rows = await this.db.select().from(portfolios).where(eq(portfolios.ownerId, clientIdentifier));
      if(!rows.length){
        return err(new PortfolioNotFoundError(`Portfolio not found for client with id: ${clientIdentifier}`))
      }

      const portfolioToDomain = this.portfolioMapper.toDomain(rows[0]);

      const holdingsRows = await this.db.select().from(holdings).where(eq(holdings.portfolioId, portfolioToDomain.portfolioIdentifier));
      const holdingsToDomain = holdingsRows.map((row) => this.holdingMapper.toDomain(row));
      portfolioToDomain.setHoldings(holdingsToDomain);
      
      return ok(portfolioToDomain);
    } catch (e: any) {
      return err(new Error(`Could not list portfolios: ${e.message}`));
    }
  }
}
