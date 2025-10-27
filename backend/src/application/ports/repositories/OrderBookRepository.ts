import { OrderBook } from "../../../domain/entities/OrderBook";
import { OrderBookNotFoundError } from "../../../domain/errors/OrderBookNotFoundError";
import { Result } from "../../../shared/Result";

export interface OrderBookRepository {
  save(orderBook: OrderBook): Promise<Result<OrderBook, Error>>;
  findByStockId(stockIDentifier: string): Promise<Result<OrderBook, OrderBookNotFoundError>>;
}