import { PortfolioRepository } from '../../application/ports/repositories/PortfolioRepository';
import { Portfolio } from '../../domain/entities/Portfolio';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class PortfolioInMemoryRepository
  extends BaseInMemoryRepository<Portfolio>
  implements PortfolioRepository
{
  constructor() {
    super((portfolio) => portfolio.id);
  }

  async findByUserId(userId: string): Promise<Portfolio | null> {
    return this.firstWhere((portfolio) => portfolio.userId === userId);
  }
}