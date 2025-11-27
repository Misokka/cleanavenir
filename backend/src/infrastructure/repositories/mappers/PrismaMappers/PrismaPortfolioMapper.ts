import { Mapper } from "../MapperInterface";
import { Portfolio as PrismaPortfolio } from "@prisma/client";
import { Portfolio } from "../../../../domain/entities/Portfolio";

type PortfolioToPersist = {
  portfolioIdentifier: string;
  clientIdentifier: string;
}
export class PrismaPortfolioMapper implements Mapper<PrismaPortfolio, Portfolio, PortfolioToPersist> {
  toDomain(raw: PrismaPortfolio): Portfolio {
    return Portfolio.create({
      ...raw
    })
  }

  toPersistence(obj: Portfolio): PortfolioToPersist {
    return {
      ...obj
    }
  }
}