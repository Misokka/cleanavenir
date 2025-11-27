import { Result } from "../../../shared/Result";
import { InvalidOrderQuantityError } from "../../../domain/errors/InvalidOrderQuantityError";
import { InvalidOrderPriceError } from "../../../domain/errors/InvalidOrderPriceError";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";
import { Order, OrderStatus } from "../../../domain/entities/Order";

export interface OrderRepository {
  save(order: Order): Promise<Result<Order, StockNotFoundError | InvalidOrderQuantityError | InvalidOrderPriceError>>;

  findById(orderIdentifier: string): Promise<Result<Order, OrderNotFoundError>>;

  setStatus(orderIdentifier: string, status: OrderStatus): Promise<Result<Order, OrderNotFoundError>>;

  listPendingBuysByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>>;
  listPendingSellsByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>>;

  listByUser(userId: string): Promise<Result<Order[], never>>;
}