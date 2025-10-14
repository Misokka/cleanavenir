import { Result } from "../../../shared/Result";
import { InvalidOrderQuantityError } from "../../../domain/errors/InvalidOrderQuantityError";
import { InvalidOrderPriceError } from "../../../domain/errors/InvalidOrderPriceError";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";
import { Order, OrderStatus, OrderType } from "../../../domain/entities/Order";



export interface OrderRepository {
  place(input: {
    stockId: string;
    userId: string;
    type: OrderType;
    quantity: number;
    limitPrice: number; 
    fees: number;     
  }): Promise<Result<Order, StockNotFoundError | InvalidOrderQuantityError | InvalidOrderPriceError>>;

  findById(id: string): Promise<Result<Order, OrderNotFoundError>>;

  setStatus(id: string, status: OrderStatus): Promise<Result<Order, OrderNotFoundError>>;

  listOpenBuysByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>>;
  listOpenSellsByStock(stockId: string): Promise<Result<Order[], StockNotFoundError>>;

  listByUser(userId: string): Promise<Result<Order[], never>>;
}