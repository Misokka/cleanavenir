import { PrismaClient } from "@prisma/client";
import { OrderBookRepository } from "../../../application/ports/repositories/OrderBookRepository";
import { OrderBook } from "../../../domain/entities/OrderBook";
import Result from "../../../shared/Result";
import { OrderBookNotFoundError } from "../../../domain/errors/OrderBookNotFoundError";

export class PrismaOrderBookRepository implements OrderBookRepository {
  constructor(
    private prismaClient: PrismaClient
  ){}

  async save(orderBook: OrderBook): Promise<Result<OrderBook, Error>> {
    try{
      const registeredOrderBook = await this.prismaClient;
    } catch (error){

    }
  }

  async findByStockId(stockIDentifier: string): Promise<Result<OrderBook, OrderBookNotFoundError>> {
      
  }
}