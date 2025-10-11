import { Result } from "../../../shared/Result";
import { OrderDTO, OrderType, OrderStatus } from "../../dtos/OrderDTO";
import { InvalidOrderQuantityError } from "../../../domain/errors/InvalidOrderQuantityError";
import { InvalidOrderPriceError } from "../../../domain/errors/InvalidOrderPriceError";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";
import { StockNotFoundError } from "../../../domain/errors/ActionNotFoundError";


export interface OrderRepository {
  place(input: {
    stockId: string;
    userId: string;
    type: OrderType;
    quantity: number;
    limitPrice: number; 
    fees: number;     
  }): Promise<Result<OrderDTO, StockNotFoundError | InvalidOrderQuantityError | InvalidOrderPriceError>>;

  findById(id: string): Promise<Result<OrderDTO, OrderNotFoundError>>;

  setStatus(id: string, status: OrderStatus): Promise<Result<OrderDTO, OrderNotFoundError>>;

  listOpenBuysByStock(stockId: string): Promise<Result<OrderDTO[], StockNotFoundError>>;
  listOpenSellsByStock(stockId: string): Promise<Result<OrderDTO[], StockNotFoundError>>;

  listByUser(userId: string): Promise<Result<OrderDTO[], never>>;
}