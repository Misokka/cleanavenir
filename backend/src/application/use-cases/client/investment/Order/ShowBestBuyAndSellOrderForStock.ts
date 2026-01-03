import { Order } from "../../../../../domain/entities/Order";
import { Stock } from "../../../../../domain/entities/Stock";
import Result, { err, ok } from "../../../../../shared/Result";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";

type BestBuyAndSellOrderType = {
  bestBuy: ClientOrderObj | null,
  bestSell: ClientOrderObj | null
}

type ClientOrderObj = {
  order: Order,
  stock: Stock
}

export class ShowBestBuyAndSellOrderForStockUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
  ){}

  async execute({ stockId }: {stockId: string}): Promise<Result<BestBuyAndSellOrderType, Error>>{
    const stockResult = await this.stockRepository.findById(stockId);
    if(!stockResult.ok) return err(stockResult.error);
    const stock = stockResult.value;

    const bestBuyOrdersResult = await this.orderRepository.listPendingBuysByStock(stock.stockIdentifier);
    if(!bestBuyOrdersResult.ok) return err(bestBuyOrdersResult.error);
    const bestBuyOrder = bestBuyOrdersResult.value[0] ?? null;

    const bestSellOrdersResult = await this.orderRepository.listPendingSellsByStock(stock.stockIdentifier);
    if(!bestSellOrdersResult.ok) return err(bestSellOrdersResult.error);
    const bestSellOrder = bestSellOrdersResult.value[0] ?? null;

    const bestBuyAndSellOrderObj: BestBuyAndSellOrderType = {
      bestBuy: {
        order: bestBuyOrder,
        stock: stock
      },
      bestSell: {
        order: bestSellOrder,
        stock: stock
      }
    }

    return ok(bestBuyAndSellOrderObj)
  }
}