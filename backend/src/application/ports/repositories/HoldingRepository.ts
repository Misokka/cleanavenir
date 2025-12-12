import { Holding } from "../../../domain/entities/Holding";
import { HoldingNotFoundError } from "../../../domain/errors/HoldingNotFoundError";
import { Result } from "../../../shared/Result";

export interface HoldingRepository {
  save(holding: Holding): Promise<Result<Holding, Error>>;
  findById(holdingIdentifier: string): Promise<Result<Holding, HoldingNotFoundError>>;
  update(holdingIdentifier: string, quantity: number): Promise<Result<Holding, HoldingNotFoundError | Error>>;
  listByUserPortfolio(portfolioIdentifier: string): Promise<Result<Map<string, Holding>, never>>;
  delete(holdingIdentifier: string): Promise<Result<void, HoldingNotFoundError>>;
}