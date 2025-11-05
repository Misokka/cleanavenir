import { OrderRepository } from '../../../application/ports/repositories/OrderRepository';
import { Order } from '../../../domain/entities/Order';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

export class OrderInMemoryRepository
  extends BaseInMemoryRepository<Order>
  implements OrderRepository
{
  constructor() {
    super((order) => order.id);
  }

  async findAllByStockId(stockId: string): Promise<Order[]> {
    return this.where((order) => order.stockId === stockId);
  }

  async findAllByPortfolioId(portfolioId: string): Promise<Order[]> {
    return this.where((order) => order.portfolioId === portfolioId);
  }
}