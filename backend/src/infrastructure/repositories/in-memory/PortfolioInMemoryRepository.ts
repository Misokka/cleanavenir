import { PortfolioRepository } from '../../../application/ports/repositories/PortfolioRepository';
import { Portfolio } from '../../../domain/entities/Portfolio';
import { Result, ok, err } from '../../../shared/Result';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { PortfolioNotFoundError } from '../../../domain/errors/PortfolioNotFoundError';

export class PortfolioInMemoryRepository implements PortfolioRepository {
  private portfolios = new Map<string, Portfolio>();

  private clone<T>(v: T): T {
    try { return structuredClone(v); } catch { return JSON.parse(JSON.stringify(v)); }
  }

  async save(portfolio: Portfolio): Promise<Result<Portfolio, UserNotFoundError>> {
    // dnas un in-memory, on ne vérifie pas l'existence de l'utilisateur ; on suppose que l'appelant a validé l'utilisateur
    this.portfolios.set(portfolio.portfolioIdentifier, this.clone(portfolio));
    return ok(portfolio);
  }

  async findByClientId(clientIdentifier: string): Promise<Result<Portfolio, PortfolioNotFoundError>> {
    const p = Array.from(this.portfolios.values()).find(pl => (pl as any).clientIdentifier === clientIdentifier);
    if (!p) return err(new PortfolioNotFoundError(clientIdentifier));
    return ok(this.clone(p));
  }
}