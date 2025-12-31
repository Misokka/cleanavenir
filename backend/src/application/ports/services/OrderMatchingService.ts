import { ok, err, Result } from "../../../shared/Result";
import { OrderRepository } from "../repositories/OrderRepository";
import { StockRepository } from "../repositories/StockRepository";
import { PortfolioRepository } from "../repositories/PortfolioRepository";
import { BankAccountRepository } from "../repositories/BankAccountRepository";
import { ORDER_FEES } from "../../../shared/constants/Investment";
import { StockPriceHistoryRepository } from "../repositories/StockPriceHistoryRepository";
import { StockPriceHistory } from "../../../domain/entities/StockPriceHistory";
import { randomUUID } from "crypto";
import { TradeRepository } from "../repositories/TradeRepository";
import { Trade } from "../../../domain/entities/Trade";


export class OrderMatchingService {
  constructor(
    private orderRepository: OrderRepository,
    private stockRepository: StockRepository,
    private stockPriceHistoryRepository: StockPriceHistoryRepository,
    private portfolioRepository: PortfolioRepository,
    private readonly tradeRepository: TradeRepository,
    private bankAccountRepository: BankAccountRepository,
  ) {}

  async match(stockId: string): Promise<Result<void, Error>> {
    
    const buyResult = await this.orderRepository.listPendingBuysByStock(stockId);
    if (!buyResult.ok) return err(buyResult.error);
    const buyOrders = buyResult.value; // trié par prix décroissant

    const sellResult = await this.orderRepository.listPendingSellsByStock(stockId);
    if (!sellResult.ok) return err(sellResult.error);
    const sellOrders = sellResult.value; // trié par prix croissant

    if (buyOrders.length === 0 || sellOrders.length === 0) {
      return ok(undefined);
    }

    while(buyOrders.length > 0 && sellOrders.length > 0){
      const bestBuy = buyOrders[0];
      const bestSell = sellOrders[0];
  
      if (bestBuy.limitPrice < bestSell.limitPrice) {
        break;
      }

      const tradedQuantity = Math.min(bestBuy.quantity, bestSell.quantity);
      const executionPrice = bestSell.limitPrice; // logique d’équilibre
  
      const stockResult = await this.stockRepository.findById(stockId);
      if (!stockResult.ok) return err(stockResult.error);
      const stock = stockResult.value;
  
      stock.updatePrice(executionPrice); // met à jour le prix du stock
      const updatedStockResult = await this.stockRepository.update(stock); // persiste le nouveau prix
      if (!updatedStockResult.ok) return err(updatedStockResult.error);

      
      const newStockPriceHistory = StockPriceHistory.create({
        stockPriceIdentifier: randomUUID(),
        stockIdentifier: stockId,
        price: executionPrice,
        recordedAt: new Date()
      });
  
      const savedStockPriceHistoryResult = await this.stockPriceHistoryRepository.save(newStockPriceHistory);
      if(!savedStockPriceHistoryResult.ok) return err(savedStockPriceHistoryResult.error);

      const trade = Trade.create({
        tradeIdentifier: randomUUID(),
        stockIdentifier: stockId,
        buyOrderIdentifier: bestBuy.orderIdentifier,
        sellOrderIdentifier: bestSell.orderIdentifier,
        quantity: tradedQuantity,
        price: executionPrice,
        createdAt: new Date()
      });

      const savedTradeResult = await this.tradeRepository.save(trade);
      if(!savedTradeResult.ok) return err(savedTradeResult.error);

      const buyerPortfolioResult = await this.portfolioRepository.findByClientId(bestBuy.clientIdentifier);
  
      if(!buyerPortfolioResult.ok) return err(buyerPortfolioResult.error);
  
      const buyerPortfolio = buyerPortfolioResult.value;
      buyerPortfolio.addHolding(stockId, tradedQuantity);
  
      const updatedPortfolioResult = await this.portfolioRepository.update(buyerPortfolio);
      if(!updatedPortfolioResult.ok){
        return err(updatedPortfolioResult.error);
      }

      const sellerBankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(bestSell.clientIdentifier)
      if(!sellerBankAccountResult.ok){
        return err(sellerBankAccountResult.error);
      }
  
      const sellerBankAccount = sellerBankAccountResult.value;
      const totalSaleAmount = (tradedQuantity * executionPrice - ORDER_FEES) * 100;
      sellerBankAccount.deposit(totalSaleAmount);
  
      const updatedBankAccountResult = await this.bankAccountRepository.updateBalance(sellerBankAccount.accountIdentifier, sellerBankAccount.balance);
      if(!updatedBankAccountResult.ok) return err(updatedBankAccountResult.error);

      //Créer une transaction ici

      // mise à jour des ordres
      bestBuy.quantity -= tradedQuantity;
      bestSell.quantity -= tradedQuantity;

      if(bestBuy.quantity === 0){
        bestBuy.status = "EXECUTED";
        buyOrders.shift(); 
      } else {
        bestBuy.status = "PARTIALLY_FILLED";
      }

      const buyOrderResult = await this.orderRepository.setStatus(bestBuy.orderIdentifier, bestBuy.status);
      if (!buyOrderResult.ok) return err(buyOrderResult.error);


      if (bestSell.quantity === 0) {
        bestSell.status = "EXECUTED";
        sellOrders.shift();
      } else {
        bestSell.status = "PARTIALLY_FILLED";
      }

      const sellOrderResult = await this.orderRepository.setStatus(bestSell.orderIdentifier, bestSell.status);
      if (!sellOrderResult.ok) return err(sellOrderResult.error);
    }

    return ok(undefined);
  }
}
