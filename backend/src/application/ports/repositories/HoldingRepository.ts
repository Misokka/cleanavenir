import { Holding } from "../../../domain/entities/Holding";
import { Result } from "../../../shared/Result";

export interface HoldingRepository {
  getHolding(portfolioIdentifier: string, stockIdentifier: string): Promise<Result<Holding, never>>; // si pas de position, retourner quantity 0
  setHolding(portfolioIdentifier: string, stockId: string, quantity: number): Promise<Result<Holding, Error>>;
  listByUserPortfolio(portfolioIdentifier: string): Promise<Result<Map<string, Holding>, never>>;
}