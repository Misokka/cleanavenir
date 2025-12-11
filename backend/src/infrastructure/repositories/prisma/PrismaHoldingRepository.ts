import { HoldingRepository } from "../../../application/ports/repositories/HoldingRepository";

export class PrismaHoldingRepository implements HoldingRepository {
  getHolding(portfolioIdentifier: string, stockIdentifier: string): Promise<Result<Holding, never>> {
    
  }

  setHolding(portfolioIdentifier: string, stockId: string, quantity: number): Promise<Result<Holding, Error>> {
    
  }

  listByUserPortfolio(portfolioIdentifier: string): Promise<Result<Map<string, Holding>, never>> {
    
  }
}