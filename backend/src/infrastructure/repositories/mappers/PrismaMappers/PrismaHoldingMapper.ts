import { Mapper } from "../MapperInterface";
import { Holding as PrismaHolding } from "@prisma/client";
import { Holding } from "../../../../domain/entities/Holding";

type HoldingToPersist = {
  holdingIdentifier: string;
  portfolioIdentifier: string;
  stockIdentifier: string;
  quantity: number;
  averagePrice: number;
}

export class PrismaHoldingMapper implements Mapper<PrismaHolding, Holding, HoldingToPersist> {
  toDomain(raw: PrismaHolding): Holding {
    return Holding.create({
      ...raw
    })
  }

  toPersistence(obj: Holding): HoldingToPersist {
    return {
      ...obj
    }
  }
}