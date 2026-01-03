import { Result } from "../../../shared/Result";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";
import { Order, OrderStatus } from "../../../domain/entities/Order";

export interface OrderRepository {
  save(order: Order): Promise<Result<Order, Error>>;
  update(order: Order): Promise<Result<Order, Error>>;
  findById(orderIdentifier: string): Promise<Result<Order, OrderNotFoundError>>;
  setStatus(orderIdentifier: string, status: OrderStatus): Promise<Result<Order, OrderNotFoundError>>;

  listPendingBuysByStock(stockIdentifier: string): Promise<Result<Order[], Error>>;
  listPendingSellsByStock(stockIdentifier: string): Promise<Result<Order[], Error>>;

  listByUser(clientIdentifier: string): Promise<Result<Order[], Error>>;
}