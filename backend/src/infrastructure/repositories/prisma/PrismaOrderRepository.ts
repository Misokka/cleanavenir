import { OrderRepository } from "../../../application/ports/repositories/OrderRepository";
import { Order } from "../../../domain/entities/Order";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";
import Result from "../../../shared/Result";

export class PrismaOrderRepository implements OrderRepository {
  save(order: Order): Promise<Result<Order, Error>> {
    
  }

  findById(orderIdentifier: string): Promise<Result<Order, OrderNotFoundError>> {
    
  }

  listByUser(userId: string): Promise<Result<Order[], never>> {
    
  }

  listPendingBuysByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>> {
    
  }

  listPendingSellsByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>> {
    
  }

  setStatus(orderIdentifier: string, status: OrderStatus): Promise<Result<Order, OrderNotFoundError>> {
    
  }
}