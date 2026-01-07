import { ok, err, Result } from "../../../shared/Result";
import { OrderRepository } from "../repositories/OrderRepository";
import { StockRepository } from "../repositories/StockRepository";
import { PortfolioRepository } from "../repositories/PortfolioRepository";
import { BankAccountRepository } from "../repositories/BankAccountRepository";
import { ORDER_FEES_IN_CENTS } from "../../../shared/constants/Investment";
import { StockPriceHistoryRepository } from "../repositories/StockPriceHistoryRepository";
import { StockPriceHistory } from "../../../domain/entities/StockPriceHistory";
import { randomUUID } from "crypto";
import { TradeRepository } from "../repositories/TradeRepository";
import { Trade } from "../../../domain/entities/Trade";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { Transaction } from "../../../domain/entities/Transaction";
import { toEuros } from "../../../shared/moneyUtilities";


export class OrderMatchingService {
  constructor(
    private orderRepository: OrderRepository,
    private stockRepository: StockRepository,
    private stockPriceHistoryRepository: StockPriceHistoryRepository,
    private portfolioRepository: PortfolioRepository,
    private readonly tradeRepository: TradeRepository,
    private bankAccountRepository: BankAccountRepository,
    private transactionRepository: TransactionRepository,
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
  
      // limitPrice est en centime
      if (bestBuy.limitPrice < bestSell.limitPrice) {
        break;
      }

      const tradedQuantity = Math.min(bestBuy.remainingQuantity, bestSell.remainingQuantity);
      const executionPrice = bestSell.limitPrice; // logique d’équilibre en centimes
  
      const stockResult = await this.stockRepository.findById(stockId);
      if (!stockResult.ok) return err(stockResult.error);
      const stock = stockResult.value;
  
      stock.updatePrice(toEuros(executionPrice)); 
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
      
      const holding = buyerPortfolio.getHolding(stockId);

      let averagePrice = executionPrice;
      if(holding){
        const oldQuantity = holding.quantity
        const newQuantity = oldQuantity + tradedQuantity;
        const oldAveragePrice = holding.averagePrice;

        const newTotalCost = (oldAveragePrice * oldQuantity) + (executionPrice * tradedQuantity);
        averagePrice = newTotalCost / newQuantity // in cents
      }

      buyerPortfolio.addHolding(stockId, tradedQuantity, averagePrice);
  
      const updatedPortfolioResult = await this.portfolioRepository.update(buyerPortfolio);
      if(!updatedPortfolioResult.ok){
        return err(updatedPortfolioResult.error);
      }

      const sellerBankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(bestSell.clientIdentifier)
      if(!sellerBankAccountResult.ok){
        return err(sellerBankAccountResult.error);
      }
  
      const sellerBankAccount = sellerBankAccountResult.value;
      const totalSaleAmount = tradedQuantity * executionPrice - ORDER_FEES_IN_CENTS; // in cents
      sellerBankAccount.deposit(totalSaleAmount);
  
      const updatedBankAccountResult = await this.bankAccountRepository.updateBalance(sellerBankAccount.accountIdentifier, sellerBankAccount.balance);
      if(!updatedBankAccountResult.ok) return err(updatedBankAccountResult.error);

      const systemBankAccountResult = await this.bankAccountRepository.getSystemBankAccount();
      if(!systemBankAccountResult.ok) return err(systemBankAccountResult.error);
      const systemBankAccount = systemBankAccountResult.value;

      systemBankAccount.withdraw(totalSaleAmount);

      const updatedSystemBankAccountResult = await this.bankAccountRepository.updateBalance(systemBankAccount.accountIdentifier, systemBankAccount.balance);
      if(!updatedSystemBankAccountResult.ok) return err(updatedSystemBankAccountResult.error);

      const newTransaction = Transaction.create({
        transactionIdentifier: randomUUID(),
        bankAccountIdentifier: sellerBankAccount.accountIdentifier,
        fromAccountIdentifier: systemBankAccount.accountIdentifier,
        toAccountIdentifier: sellerBankAccount.accountIdentifier,
        amount: totalSaleAmount,
        currency: "EUR",
        direction: "CREDIT",
        type: "STOCK_SALE",
        description : `${stock.ticker.value} stock sale benefits.`,
        createdAt: new Date()
      });

      const savedTransactionResult = await this.transactionRepository.save(newTransaction);
      if(!savedTransactionResult.ok) return err(savedTransactionResult.error);

      const newBestBuyRemainingBlockedMonyAmount = (bestBuy.remainingBlockedMoneyAmount ?? 0) - (tradedQuantity * executionPrice)
      // mise à jour des ordres
      bestBuy.remainingQuantity -= tradedQuantity;
      bestBuy.remainingBlockedMoneyAmount = newBestBuyRemainingBlockedMonyAmount;
      bestSell.remainingQuantity -= tradedQuantity;

      if(bestBuy.remainingQuantity === 0){
        bestBuy.status = "EXECUTED";
        if(bestBuy.remainingBlockedMoneyAmount && bestBuy.remainingBlockedMoneyAmount > 100){ // > 100 car on laisse les frais d'achat
          const buyerBankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(bestBuy.clientIdentifier);
          if(!buyerBankAccountResult.ok) return err(buyerBankAccountResult.error);
          const buyerBankAccount = buyerBankAccountResult.value;

          buyerBankAccount.deposit(bestBuy.remainingBlockedMoneyAmount);
          const updatedBalanceResult = await this.bankAccountRepository.updateBalance(buyerBankAccount.accountIdentifier, buyerBankAccount.balance);
          if(!updatedBalanceResult.ok) return err(updatedBalanceResult.error);

          const remainingMoneyTransaction = Transaction.create({
            transactionIdentifier: randomUUID(),
            bankAccountIdentifier: buyerBankAccount.accountIdentifier,
            fromAccountIdentifier: systemBankAccount.accountIdentifier,
            toAccountIdentifier: buyerBankAccount.accountIdentifier,
            amount: bestBuy.remainingBlockedMoneyAmount,
            currency: "EUR",
            description: `Refund for remaining money of ${stock.ticker.value} stocks purchase.`,
            direction: "CREDIT",
            type: "ORDER_REFUND",
            createdAt: new Date()
          });

          const savedTransactionResult = await this.transactionRepository.save(remainingMoneyTransaction);
          if(!savedTransactionResult.ok) return err(savedTransactionResult.error);
        }
        buyOrders.shift(); 
      } else {
        bestBuy.status = "PARTIALLY_FILLED";
      }

      const updateBuyOrderResult = await this.orderRepository.update(bestBuy);
      if (!updateBuyOrderResult.ok) return err(updateBuyOrderResult.error);


      if (bestSell.remainingQuantity === 0) {
        bestSell.status = "EXECUTED";
        sellOrders.shift();
      } else {
        bestSell.status = "PARTIALLY_FILLED";
      }

      const updateSellOrderResult = await this.orderRepository.update(bestSell);
      if (!updateSellOrderResult.ok) return err(updateSellOrderResult.error);
    }

    return ok(undefined);
  }
}
