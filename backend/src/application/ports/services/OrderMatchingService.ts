import { ok, err, Result } from "../../../shared/Result";
import { OrderType, OrderStatus } from "../../../domain/entities/Order";
import { Stock } from "../../../domain/entities/Stock";
import { OrderRepository } from "../repositories/OrderRepository";
import { StockRepository } from "../repositories/StockRepository";
import { PortfolioRepository } from "../repositories/PortfolioRepository";


export class OrderMatchingService {
  constructor(
    private orderRepository: OrderRepository,
    private stockRepository: StockRepository,
    private portfolioRepository: PortfolioRepository
  ) {}

  async match(stockId: string): Promise<Result<void, Error>> {
    
    const buyResult = await this.orderRepository.listPendingBuysByStock(stockId);
    if (!buyResult.ok) return err(buyResult.error);
    const buyOrders = buyResult.value;

    const sellResult = await this.orderRepository.listPendingSellsByStock(stockId);
    if (!sellResult.ok) return err(sellResult.error);
    const sellOrders = sellResult.value;

    
    if (buyOrders.length === 0 || sellOrders.length === 0) {
      return ok(undefined);
    }
    
    const bestBuy = buyOrders[0];
    const bestSell = sellOrders[0];

    if (bestBuy.limitPrice < bestSell.limitPrice) {
      return ok(undefined);
    }
    
    const tradedQuantity = Math.min(bestBuy.quantity, bestSell.quantity);
    const executionPrice = bestSell.limitPrice; // logique d’équilibre

    const stockResult = await this.stockRepository.findById(stockId);
    if (!stockResult.ok) return err(stockResult.error);
    const stock = stockResult.value;

    stock.updatePrice(executionPrice); // met à jour le prix du stock
    const updatedStockResult = await this.stockRepository.update(stock); // persiste le nouveau prix
    if (!updatedStockResult.ok) return err(updatedStockResult.error);

    bestBuy.status = "EXECUTED";
    bestSell.status = "EXECUTED";

    const buyOrderResult = await this.orderRepository.save(bestBuy);
    if (!buyOrderResult.ok) return err(buyOrderResult.error);

    const sellOrderResult = await this.orderRepository.save(bestSell);
    if (!sellOrderResult.ok) return err(sellOrderResult.error);

    const buyerPortfolioResult = await this.portfolioRepository.findByClientId(bestBuy.clientIdentifier);
    const sellerPortfolioResult = await this.portfolioRepository.findByClientId(bestSell.clientIdentifier);

    if(!buyerPortfolioResult.ok) return err(buyerPortfolioResult.error);
    if(!sellerPortfolioResult.ok) return err(sellerPortfolioResult.error);

    const buyerPortfolio = buyerPortfolioResult.value;
    const sellerPortfolio = sellerPortfolioResult.value;

    buyerPortfolio.addHolding(stockId, tradedQuantity);
    sellerPortfolio.removeHolding(stockId, tradedQuantity);

    await this.portfolioRepository.save(buyerPortfolio);
    await this.portfolioRepository.save(sellerPortfolio);

    return ok(undefined);
  }
}
