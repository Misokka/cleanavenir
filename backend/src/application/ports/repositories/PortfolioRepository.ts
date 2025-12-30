import { Portfolio } from "../../../domain/entities/Portfolio";
import { PortfolioNotFoundError } from "../../../domain/errors/PortfolioNotFoundError";
import { UserNotFoundError } from "../../../domain/errors/UserNotFoundError";
import { Result } from "../../../shared/Result";

export interface PortfolioRepository{
  save(portfolio: Portfolio): Promise<Result<Portfolio, Error>>;
  update(portfolio: Portfolio): Promise<Result<Portfolio, Error>>;
  findByClientId(clientIdentifier: string): Promise<Result<Portfolio, PortfolioNotFoundError>>;
}