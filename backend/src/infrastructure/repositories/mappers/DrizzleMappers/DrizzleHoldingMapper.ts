import { Holding } from "../../../../domain/entities/Holding";
import { HoldingDrizzle, NewHoldingDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleHoldingMapper implements Mapper<HoldingDrizzle, Holding, NewHoldingDrizzle> {
  toDomain(raw: HoldingDrizzle): Holding {
    return {
      holdingIdentifier: raw.id,
      portfolioIdentifier: raw.portfolioId,
      quantity: raw.quantity,
      stockIdentifier: raw.stockId,
      averagePrice: raw.averagePrice
    };
  }

  toPersistence(entity: Holding): NewHoldingDrizzle {
    return {
      id: entity.holdingIdentifier,
      portfolioId: entity.portfolioIdentifier,
      quantity: entity.quantity,
      stockId: entity.stockIdentifier,
      averagePrice: entity.averagePrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
