import { PortfolioRepository } from "../../../application/ports/repositories/PortfolioRepository";

export class PrismaPortfolioRepository implements PortfolioRepository {
  save(portfolio: Portfolio): Promise<Result<Portfolio, UserNotFoundError>> {
    
  }

  findByClientId(clientIdentifier: string): Promise<Result<Portfolio, PortfolioNotFoundError>> {
    
  }
}