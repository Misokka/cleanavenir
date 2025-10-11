import { Result } from "../../../shared/Result";
import { OrderDTO, OrderSide, OrderStatus } from "../../dtos/OrderDTO";
import { ActionNotFoundError } from "../../../domain/errors/ActionNotFoundError";
import { InvalidOrderQuantityError } from "../../../domain/errors/InvalidOrderQuantityError";
import { InvalidOrderPriceError } from "../../../domain/errors/InvalidOrderPriceError";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";


export interface OrderRepository {
  place(input: {
    actionId: string;
    userId: string;
    side: OrderSide;
    quantity: number;
    limitPrice: number; 
    fees: number;     
  }): Promise<Result<OrderDTO, ActionNotFoundError | InvalidOrderQuantityError | InvalidOrderPriceError>>;

  findById(id: string): Promise<Result<OrderDTO, OrderNotFoundError>>;

  setStatus(id: string, status: OrderStatus): Promise<Result<OrderDTO, OrderNotFoundError>>;

  listOpenBuysByAction(actionId: string): Promise<Result<OrderDTO[], ActionNotFoundError>>;
  listOpenSellsByAction(actionId: string): Promise<Result<OrderDTO[], ActionNotFoundError>>;

  listByUser(userId: string): Promise<Result<OrderDTO[], never>>;
}