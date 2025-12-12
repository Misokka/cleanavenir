import { PrismaClient } from "@prisma/client";
import { HoldingRepository } from "../../../application/ports/repositories/HoldingRepository";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaHoldingMapper } from "../mappers/PrismaMappers/PrismaHoldingMapper";
import { Holding } from "../../../domain/entities/Holding";
import { HoldingNotFoundError } from "../../../domain/errors/HoldingNotFoundError";

export class PrismaHoldingRepository implements HoldingRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaHoldingMapper: PrismaHoldingMapper
  ){}
  async save(holding: Holding): Promise<Result<Holding, Error>> {
    try{
      const holdingtoPersistence = this.prismaHoldingMapper.toPersistence(holding);

      const registeredHolding = await this.prismaClient.holding.create({
        data: { ...holdingtoPersistence }
      });

      const holdingToDomain = this.prismaHoldingMapper.toDomain(registeredHolding);
      return ok(holdingToDomain);

    } catch (error) {
      return err(new Error(`An error occured when saving holding ${holding.holdingIdentifier}`))
    }
  }

  async findById(holdingIdentifier: string): Promise<Result<Holding, HoldingNotFoundError | Error>> {
    try{
      const foundHolding = await this.prismaClient.holding.findUnique({
        where: {
          holdingIdentifier: holdingIdentifier
        }
      });

      if(!foundHolding){
        return err(new HoldingNotFoundError(holdingIdentifier));
      }

      const holdingToDomain = this.prismaHoldingMapper.toDomain(foundHolding);
      return ok(holdingToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving holding ${holdingIdentifier}`))
    }
  }

  async update(holdingIdentifier: string, quantity: number): Promise<Result<Holding, Error>> {
    try{
      const updatedHolding = await this.prismaClient.holding.update({
        where: {
          holdingIdentifier: holdingIdentifier
        },
        data: {
          quantity: quantity
        }
      });

      const holdingToDomain = this.prismaHoldingMapper.toDomain(updatedHolding);
      return ok(holdingToDomain);
    } catch (error) {
      return err(new Error(`An error occured when updating holding ${holdingIdentifier}`))
    }
  }

  async listByUserPortfolio(portfolioIdentifier: string): Promise<Result<Map<string, Holding>, never>> {
    const holdings = await this.prismaClient.holding.findMany({
      where: {
        portfolioIdentifier: portfolioIdentifier
      }
    });

    const holdingsMap: Map<string, Holding> = new Map();

    holdings.forEach((holding) => {
      const holdingToDomain = this.prismaHoldingMapper.toDomain(holding);
      holdingsMap.set(holding.stockIdentifier, holdingToDomain);
    });

    return ok(holdingsMap);
  }

  async delete(holdingIdentifier: string): Promise<Result<void, HoldingNotFoundError>> {
    const holding = await this.prismaClient.holding.findUnique({
      where: {
        holdingIdentifier: holdingIdentifier
      }
    });

    if(!holding){
      return err(new HoldingNotFoundError(holdingIdentifier));
    }

    await this.prismaClient.holding.delete({
      where: {
        holdingIdentifier: holdingIdentifier
      }
    });

    return ok(undefined);
  }
}