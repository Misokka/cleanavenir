
import { randomUUID } from "crypto";
import { Holding } from "../../../../../domain/entities/Holding";
import Result, { err, ok } from "../../../../../shared/Result";
import { BankAccountRepository } from "../../../../ports/repositories/BankAccountRepository";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { CancelOrderRequest } from "./requests/CancelOrderRequest";
import { StockRepository } from "../../../../ports/repositories/StockRepository";
import { Transaction } from "../../../../../domain/entities/Transaction";
import { TransactionRepository } from "../../../../ports/repositories/TransactionRepository";

export class CancelOrderUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly orderRepository: OrderRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly stockRepository: StockRepository,
  ){}

  async execute({ userIdentifier, orderIdentifier}: CancelOrderRequest): Promise<Result<boolean, Error>>{
    const clientResult = await this.clientRepository.findByUserId(userIdentifier);
    if(!clientResult.ok) return err(clientResult.error);

    const client = clientResult.value;

    const orderResult = await this.orderRepository.findById(orderIdentifier);
    if(!orderResult.ok) return err(orderResult.error);

    const order = orderResult.value;

    const stockResult = await this.stockRepository.findById(order.stockIdentifier);
    if(!stockResult.ok) return err(stockResult.error);
    const stock = stockResult.value;

    const CANCELLABLE_STATUSES = ["PENDING", "PARTIALLY_FILLED"];


    if(CANCELLABLE_STATUSES.includes(order.status)){
      order.status = "CANCELLED";
      const updatedOrderResult = await this.orderRepository.setStatus(order.orderIdentifier, order.status);
      if(!updatedOrderResult.ok) return err(updatedOrderResult.error);
    } else {
      return err(new Error("Cannot cancel this order as it is not a pending nor a partially filled Order anymore."))
    }

    if(order.orderType === "BUY"){

      const clientBankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(client.clientIdentifier);
      if(!clientBankAccountResult.ok) return err(clientBankAccountResult.error);
      const clientBankAccount = clientBankAccountResult.value;

      const systemBankAccountResult = await this.bankAccountRepository.getSystemBankAccount();
      if(!systemBankAccountResult.ok) return err(systemBankAccountResult.error);
      const systemBankAccount = systemBankAccountResult.value;

      const reservedFunds = order.remainingBlockedMoneyAmount ?? 0;
      clientBankAccount.deposit(reservedFunds);

      const updatedBankAccountResult = await this.bankAccountRepository.updateBalance(clientBankAccount.accountIdentifier, clientBankAccount.balance);
      if(!updatedBankAccountResult.ok) return err(updatedBankAccountResult.error);

      const remainingMoneyTransaction = Transaction.create({
        transactionIdentifier: randomUUID(),
        bankAccountIdentifier: clientBankAccount.accountIdentifier,
        fromAccountIdentifier: systemBankAccount.accountIdentifier,
        toAccountIdentifier: clientBankAccount.accountIdentifier,
        amount: order.remainingBlockedMoneyAmount ?? 0,
        currency: "EUR",
        description: `Refund for cancelling of ${stock.ticker.value} stocks purchase.`,
        direction: "CREDIT",
        type: "ORDER_REFUND",
        createdAt: new Date()
      });

      const savedTransactionResult = await this.transactionRepository.save(remainingMoneyTransaction);
      if(!savedTransactionResult.ok) return err(savedTransactionResult.error);

    } else if(order.orderType === "SELL"){

      const clientPortfolioResult = await this.portfolioRepository.findByClientId(client.clientIdentifier);
      if(!clientPortfolioResult.ok) return err(clientPortfolioResult.error);
      const clientPortfolio = clientPortfolioResult.value;

      const stockQuantity = order.remainingQuantity ?? 0

      const currentAveragePrice = order.sellerHoldingAveragePrice ?? 0;
      clientPortfolio.addHolding(order.stockIdentifier, stockQuantity, currentAveragePrice);

      const updatedPortfolioResult = await this.portfolioRepository.update(clientPortfolio);
      if(!updatedPortfolioResult.ok) return err(updatedPortfolioResult.error);
    } else {
      return err(new Error("Invalid Order type"));
    }

    return ok(true);
  }
}