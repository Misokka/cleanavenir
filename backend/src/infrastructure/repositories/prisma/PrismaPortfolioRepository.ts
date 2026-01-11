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
    try{
      const portfolioToPersistence = this.prismaPortfolioMapper.toPersistence(portfolio);

      const registeredPortfolio = await this.prismaClient.portfolio.create({
        data: { ...portfolioToPersistence }
      });

      const portfolioToDomain = this.prismaPortfolioMapper.toDomain(registeredPortfolio);
      return ok(portfolioToDomain)
    } catch (error) {
      return err(new UserNotFoundError(portfolio.clientIdentifier))
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
    try{
      const toPersit = this.prismaPortfolioMapper.toPersistence(portfolio);
      const updatedPortfolio = await this.prismaClient.portfolio.update({
        where: {
          portfolioIdentifier: portfolio.portfolioIdentifier,
        },
        data: toPersit
      });
      const toDomain = this.prismaPortfolioMapper.toDomain(updatedPortfolio);
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(`An error occured when updating portfolio: ${portfolio.portfolioIdentifier}. Message: ${error.message}`))
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