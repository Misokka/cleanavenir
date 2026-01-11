import { PrismaClient } from "@prisma/client";
import { PortfolioRepository } from "../../../application/ports/repositories/PortfolioRepository";
import { Portfolio } from "../../../domain/entities/Portfolio";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaPortfolioMapper } from "../mappers/PrismaMappers/PrismaPortfolioMapper";
import { PortfolioNotFoundError } from "../../../domain/errors/PortfolioNotFoundError";
import { PrismaHoldingMapper } from "../mappers/PrismaMappers/PrismaHoldingMapper";

export class PrismaPortfolioRepository implements PortfolioRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaPortfolioMapper: PrismaPortfolioMapper,
    private readonly prismaHoldingMapper: PrismaHoldingMapper
  ){}

async save(portfolio: Portfolio): Promise<Result<Portfolio, UserNotFoundError>> {
    try {
      
      const portfolioToPersist = this.prismaPortfolioMapper.toPersistence(portfolio);
      
      const holdingsToPersist = portfolio.allHoldings().map((holding) => 
        this.prismaHoldingMapper.toPersistence(holding)
      );

      const registeredPortfolio = await this.prismaClient.portfolio.create({
        data: {
          ...portfolioToPersist,
        },
      });

      const portfolioToDomain = this.prismaPortfolioMapper.toDomain(registeredPortfolio);

      for(const holding of holdingsToPersist){
        const savedHolding = await this.prismaClient.holding.create({
          data: holding
        });
        const holdingToDomain = this.prismaHoldingMapper.toDomain(savedHolding);
        portfolioToDomain.addHolding(holdingToDomain.stockIdentifier, holdingToDomain.quantity, holdingToDomain.averagePrice)
      }

      return ok(portfolioToDomain);

    } catch (error: any) {
      console.error("Error saving portfolio:", error);
      return err(new UserNotFoundError(portfolio.clientIdentifier));
    }
  }

  async findByClientId(clientIdentifier: string): Promise<Result<Portfolio, PortfolioNotFoundError>> {
    try{
      const maybePortfolio = await this.prismaClient.portfolio.findUnique({
        where: {
          clientIdentifier: clientIdentifier
        }
      });

      if(!maybePortfolio){
        return err(new PortfolioNotFoundError(clientIdentifier))
      }

      const portfolioToDomain = this.prismaPortfolioMapper.toDomain(maybePortfolio);
      return ok(portfolioToDomain)
    } catch (error) {
      return err(new PortfolioNotFoundError(clientIdentifier))
    }
  }

async update(portfolio: Portfolio): Promise<Result<Portfolio, Error>> {
    try {
      const portfolioToPersist = this.prismaPortfolioMapper.toPersistence(portfolio);
    
      const domainHoldings = portfolio.allHoldings();
    
      const currentHoldingIds = domainHoldings.map(h => h.holdingIdentifier);

      const updatedPortfolio = await this.prismaClient.portfolio.update({
        where: {
          portfolioIdentifier: portfolio.portfolioIdentifier
        },
        data: portfolioToPersist
      })

      const updatedPortfolioToDomain = this.prismaPortfolioMapper.toDomain(updatedPortfolio);

      await this.prismaClient.holding.deleteMany({
        where: {
          portfolioIdentifier: portfolio.portfolioIdentifier,
          holdingIdentifier: {
            notIn: currentHoldingIds
          }
        }
      });

      for(const holding of domainHoldings){
        const holdingToPersist = this.prismaHoldingMapper.toPersistence(holding);

        const upserted = await this.prismaClient.holding.upsert({
          where: { holdingIdentifier: holding.portfolioIdentifier},
          create: holdingToPersist,
          update: holdingToPersist
        });

        updatedPortfolioToDomain.addHolding(upserted.stockIdentifier, upserted.quantity, upserted.averagePrice)
        
      }
    
      return ok(updatedPortfolioToDomain);

    } catch (error: any) {
      console.error("Error updating portfolio:", error);
      return err(new Error(`An error occured when updating portfolio: ${portfolio.portfolioIdentifier}. Message: ${error.message}`));
    }
  }

  async delete(portfolioIdentifier: string): Promise<Result<boolean, Error>> {
    try{
      const deletedPortfolio = await this.prismaClient.portfolio.delete({
        where: {
          portfolioIdentifier
        }});
      if(!deletedPortfolio) return err(new Error(`Couldn't delete portfolio ${portfolioIdentifier}`))
      
      return ok(true);
    } catch (error: any) {
      return err(new Error(`An error occured when deleting portfolio: ${portfolioIdentifier}. Message: ${error.message}`))
    }
  }


}