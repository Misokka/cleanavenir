import Result, { err, ok } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";
import { Stock } from "../../../../../domain/entities/Stock";
import { Order } from "../../../../../domain/entities/Order";

type ClientOrderObj = {
  order: Order,
  stock: Stock
}

export class ListMyOrdersUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
  ){}

  async execute({ userId }: { userId: string}): Promise<Result<ClientOrderObj[], Error>>{
    const clientResult = await this.clientRepository.findByUserId(userId);
    if(!clientResult.ok) return err(clientResult.error);
    const client = clientResult.value;

    const clientOrdersResult = await this.orderRepository.listByUser(client.clientIdentifier);
    if(!clientOrdersResult.ok) return err(clientOrdersResult.error);
    const clientOrders = clientOrdersResult.value;

    const stocksResult = await this.stockRepository.all();
    if(!stocksResult.ok) return err(stocksResult.error);
    const stocks = stocksResult.value;

    const allOrders = clientOrders.map((order) => {
      const orderStock = stocks.find(stock => order.stockIdentifier === stock.stockIdentifier) as Stock;
      const clientOrder: ClientOrderObj = {
        order,
        stock: orderStock
      }
      
      return clientOrder
    });

    return ok(allOrders)
  }
}