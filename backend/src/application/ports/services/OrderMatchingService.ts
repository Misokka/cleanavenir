import { err } from "../../../shared/Result";
import { OrderRepository } from "../repositories/OrderRepository";
import { StockRepository } from "../repositories/StockRepository";

export class OrderMatchingService {
  constructor(
    private orderRepository: OrderRepository,
    private stockRepository: StockRepository
  ) {}

  async match(stockIdentifier: string) {
    const buyOrders = await this.orderRepository.listPendingBuysByStock(stockIdentifier);
    const sellOrders = await this.orderRepository.listPendingSellsByStock(stockIdentifier);

    if (!buyOrders.ok) {
      return err(buyOrders.error);
    };

    if(!sellOrders.ok) {
      return err(sellOrders.error);
    };

    if (buyOrders.value.length === 0 || sellOrders.value.length === 0) {
      return;
    }

    // Trier les ordres d'achat par prix décroissant et les ordres de vente par prix croissant
    buyOrders.value.sort((a, b) => b.limitPrice - a.limitPrice);
    sellOrders.value.sort((a, b) => a.limitPrice - b.limitPrice);

    const highestBuy = buyOrders.value[0];
    const lowestSell = sellOrders.value[0];

    if (highestBuy.limitPrice >= lowestSell.limitPrice) {
      const executionPrice = lowestSell.limitPrice;

      // Exécution
      highestBuy.status = "EXECUTED";
      lowestSell.status = "EXECUTED";

      // Mise à jour du prix
      const stock = await this.stockRepository.findById(stockIdentifier);
      if (!stock.ok) {
        return err(stock.error);
      }

      stock.value.updatePrice(executionPrice);
      await this.stockRepository.save(stock.value);

      await this.orderRepository.save(highestBuy);
      await this.orderRepository.save(lowestSell);

      return {
        price: executionPrice,
        stockIdentifier,
        buyOrderIdentifier: highestBuy.orderIdentifier,
        sellOrderIdentifier: lowestSell.orderIdentifier
      };
    }
  }
}
