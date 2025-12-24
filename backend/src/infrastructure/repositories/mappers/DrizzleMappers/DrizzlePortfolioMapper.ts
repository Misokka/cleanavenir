import { Portfolio } from "../../../../domain/entities/Portfolio";
import { PortfolioDrizzle, NewPortfolioDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzlePortfolioMapper implements Mapper<PortfolioDrizzle, Portfolio, NewPortfolioDrizzle> {
  toDomain(raw: PortfolioDrizzle): Portfolio {
    return Portfolio.create({
      ...raw,
      portfolioIdentifier: raw.id,
      clientIdentifier: raw.ownerId,
      createdAt: new Date(raw.createdAt)
    });
  }

  toPersistence(entity: Portfolio): NewPortfolioDrizzle {
    return {
      ...entity,
      id: entity.portfolioIdentifier,
      ownerId: entity.clientIdentifier,
      createdAt: entity.createdAt.toISOString()
    };
  }
}
