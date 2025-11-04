import { StockRepository } from '../../application/ports/repositories/StockRepository';
import { Stock } from '../../domain/entities/Stock';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class StockInMemoryRepository
  extends BaseInMemoryRepository<Stock>
  implements StockRepository
{
  constructor() {
    super((stock) => stock.id);
  }

  async findByTicker(ticker: string): Promise<Stock | null> {
    // On suppose que Ticker est un Value Object avec un champ `value`
    return this.firstWhere((stock) => stock.ticker.value === ticker);
  }
}