import { OrderRepository } from '../../../application/ports/repositories/OrderRepository';
import { Order, OrderStatus, OrderType } from '../../../domain/entities/Order';
import { Result, ok, err } from '../../../shared/Result';
import { InvalidOrderQuantityError } from '../../../domain/errors/InvalidOrderQuantityError';
import { InvalidOrderPriceError } from '../../../domain/errors/InvalidOrderPriceError';
import { OrderNotFoundError } from '../../../domain/errors/OrderNotFoundError';
import { StockNotFoundError } from '../../../domain/errors/StockNotFoundError';
import { randomUUID } from 'crypto';

// Map-backed implementation so signatures can return Result<> as required by the interface
export class OrderInMemoryRepository implements OrderRepository {
  private orders = new Map<string, Order>();

  private clone<T>(v: T): T {
    try {
      return structuredClone(v);
    } catch {
      return JSON.parse(JSON.stringify(v));
    }
  }

  async save(
    stockId: string,
    userId: string,
    type: OrderType,
    quantity: number,
  ): Promise<Result<Order, StockNotFoundError | InvalidOrderQuantityError | InvalidOrderPriceError>> {
    if (quantity <= 0) return err(new InvalidOrderQuantityError(quantity));

    // la complexité ici est de savoir si le stock existe ou pas
    if (!stockId) return err(new StockNotFoundError(String(stockId)));

    const orderIdentifier = randomUUID();
    const limitPrice = 0; // prix limite par défaut pour l'enregistrement en mémoire

    if (limitPrice < 0) return err(new InvalidOrderPriceError(limitPrice));

    const order = new Order(orderIdentifier, userId, stockId, type, quantity, limitPrice);
    this.orders.set(orderIdentifier, this.clone(order));
    return ok(this.clone(order));
  }

  async findById(id: string): Promise<Result<Order, OrderNotFoundError>> {
    const o = this.orders.get(id);
    if (!o) return err(new OrderNotFoundError(id));
    return ok(this.clone(o));
  }

  async setStatus(id: string, status: OrderStatus): Promise<Result<Order, OrderNotFoundError>> {
    const o = this.orders.get(id);
    if (!o) return err(new OrderNotFoundError(id));
    o.status = status;
    this.orders.set(id, this.clone(o));
    return ok(this.clone(o));
  }

  async listOpenBuysByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>> {
    if (!stockId) return err(new StockNotFoundError(stockId));
    const rows = Array.from(this.orders.values()).filter(o => o.stockIdentifier === stockId && (o.status === 'OPEN' || o.status === 'PARTIALLY_FILLED') && o.type === 'BUY');
    return ok(rows.map(r => this.clone(r)));
  }

  async listOpenSellsByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>> {
    if (!stockId) return err(new StockNotFoundError(stockId));
    const rows = Array.from(this.orders.values()).filter(o => o.stockIdentifier === stockId && (o.status === 'OPEN' || o.status === 'PARTIALLY_FILLED') && o.type === 'SELL');
    return ok(rows.map(r => this.clone(r)));
  }

  async listByUser(userId: string): Promise<Result<Order[], never>> {
    const rows = Array.from(this.orders.values()).filter(o => o.portfolioIdentifier === userId);
    return ok(rows.map(r => this.clone(r)));
  }
}