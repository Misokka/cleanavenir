import { randomUUID } from "crypto";
import Result, { err, ok } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";
import { PlaceOrderRequest } from "./requests/PlaceOrderRequest";
import { Order } from "../../../../../domain/entities/Order";
import { OrderMatchingService } from "../../../../ports/services/OrderMatchingService";
import { ORDER_FEES_IN_CENTS } from "../../../../../shared/constants/Investment";
import { BankAccountRepository } from "../../../../ports/repositories/BankAccountRepository";
import { InsufficientFundsError } from "../../../../../domain/errors/InsufficientFundsError";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { InsufficientStockQuantityError } from "../../../../../domain/errors/InsufficientStockQuantityError";
import { UserRepository } from "../../../../ports/repositories/UserRepository";
import { TransactionRepository } from "../../../../ports/repositories/TransactionRepository";
import { Transaction } from "../../../../../domain/entities/Transaction";
import { toCents, toEuros } from "../../../../../shared/moneyUtilities";

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
    private readonly clientRepository: ClientRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly orderMatchingService: OrderMatchingService,
  ){}

  async execute({userIdentifier, stockIdentifier, quantity, orderType, limitPrice}: PlaceOrderRequest): Promise<Result<Order, Error>> {
    const limiPriceInCents = toCents(limitPrice);
    const clientResult = await this.clientRepository.findByUserId(userIdentifier);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value;

    const systemBankAccountResult =  await this.bankAccountRepository.getSystemBankAccount();
    if(!systemBankAccountResult.ok) return err(systemBankAccountResult.error);
    const systemBankAccount = systemBankAccountResult.value;

    const stockResult = await this.stockRepository.findById(stockIdentifier);
    if(!stockResult.ok) return err(stockResult.error);

    const stock = stockResult.value;

    let savedOrder: Order;

    const orderIdentifier = randomUUID();

    if(orderType === "BUY"){
      const buyerPortfolio = await this.portfolioRepository.findByClientId(client.clientIdentifier);
      if(!buyerPortfolio.ok) return err(new Error("You can't place an order without a portfolio."))
      const totalCostInCents = limiPriceInCents * quantity + ORDER_FEES_IN_CENTS // total cost in cents

      const clientBankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(client.clientIdentifier)
      if(!clientBankAccountResult.ok) return err(clientBankAccountResult.error);

      const clientBankAccount = clientBankAccountResult.value;

      if(!clientBankAccount.checkBalance(totalCostInCents)) return err(new InsufficientFundsError(clientBankAccount.accountIdentifier))

      clientBankAccount.withdraw(totalCostInCents) // money withdrawn but reserved
      //créer une transaction et savoir vers où va l'argent

      const newTransaction = Transaction.create({
        transactionIdentifier: randomUUID(),
        bankAccountIdentifier: clientBankAccount.accountIdentifier,
        fromAccountIdentifier: clientBankAccount.accountIdentifier,
        toAccountIdentifier: systemBankAccount.accountIdentifier,
        amount: totalCostInCents,
        currency: "EUR",
        direction: "DEBIT",
        type: "STOCK_PURCHASE",
        description: `Reserved funds for purchase of ${stock.ticker.value} stocks`,
        createdAt: new Date()
      });

      const savedTransactionResult = await this.transactionRepository.save(newTransaction);
      // if(!savedTransactionResult.ok) return err(savedTransactionResult.error);
      if(!savedTransactionResult.ok) return err(savedTransactionResult.error);


      const newOrder = Order.create({
        orderIdentifier,
        stockIdentifier,
        clientIdentifier: client.clientIdentifier,
        initialQuantity: quantity,
        remainingQuantity: quantity,
        orderType,
        blockedMoneyAmount: totalCostInCents,
        remainingBlockedMoneyAmount: totalCostInCents,
        limitPrice: limiPriceInCents,
        createdAt: new Date()
      });

      const savedOrderResult = await this.orderRepository.save(newOrder);
      if(!savedOrderResult.ok) return err(savedOrderResult.error);

      const updatedBankAccountResult = await this.bankAccountRepository.updateBalance(clientBankAccount.accountIdentifier, clientBankAccount.balance);
      if(!updatedBankAccountResult.ok) return err(updatedBankAccountResult.error);

      savedOrder = savedOrderResult.value;
    } else if(orderType === "SELL") {
      const sellClientPortfolioResult = await this.portfolioRepository.findByClientId(client.clientIdentifier);
      if(!sellClientPortfolioResult.ok) return err(sellClientPortfolioResult.error);

      const sellClientPortfolio = sellClientPortfolioResult.value;
      const stockHolding = sellClientPortfolio.getHolding(stockIdentifier);
      
      if(!stockHolding || stockHolding.quantity < quantity) return err(new InsufficientStockQuantityError(stock.stockIdentifier));

      // mettre à jour la holding
      sellClientPortfolio.removeHolding(stockHolding.stockIdentifier, quantity);

      const newOrder = Order.create({
        orderIdentifier,
        stockIdentifier,
        clientIdentifier: client.clientIdentifier,
        initialQuantity: quantity,
        remainingQuantity: quantity,
        orderType,
        blockedStockQuantity: quantity,
        limitPrice: limiPriceInCents, // Prix du marché au moment de la commande
        sellerHoldingAveragePrice: stockHolding.averagePrice,
        createdAt: new Date()
      });

      const savedOrderResult = await this.orderRepository.save(newOrder);
      if(!savedOrderResult.ok) return err(savedOrderResult.error);

      const updatedPortfolioResult = await this.portfolioRepository.update(sellClientPortfolio);
      if(!updatedPortfolioResult.ok) return err(updatedPortfolioResult.error);

      savedOrder = savedOrderResult.value;
    } else {
      return err(new Error("Invalid Order Type"));
    }


    const matchResult = await this.orderMatchingService.match(stockIdentifier); // ajoute l'ordre à la liste des ordres pour faire varier le prix de l'action
    if(!matchResult.ok) return err(matchResult.error);

    return ok(savedOrder);
  }
}