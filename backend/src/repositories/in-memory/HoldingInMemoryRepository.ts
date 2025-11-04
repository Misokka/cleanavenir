import { HoldingRepository } from '../../application/ports/repositories/HoldingRepository';
import { Holding } from '../../domain/entities/Holding';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class HoldingInMemoryRepository
  extends BaseInMemoryRepository<Holding>
  implements HoldingRepository
{
  constructor() {
    super((holding) => holding.id);
  }

  async findByPortfolioIdAndStockId(
    portfolioId: string,
    stockId: string,
  ): Promise<Holding | null> {
    return this.firstWhere(
      (h) => h.portfolioId === portfolioId && h.stockId === stockId,
    );
  }

  async findAllByPortfolioId(portfolioId: string): Promise<Holding[]> {
    return this.where((h) => h.portfolioId === portfolioId);
  }
}