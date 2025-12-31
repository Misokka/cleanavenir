import { randomUUID } from "crypto";
import Result, { err, ok } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";
import { PlaceOrderRequest } from "./requests/PlaceOrderRequest";
import { Order } from "../../../../../domain/entities/Order";
import { OrderMatchingService } from "../../../../ports/services/OrderMatchingService";
import { ORDER_FEES } from "../../../../../shared/constants/Investment";
import { BankAccountRepository } from "../../../../ports/repositories/BankAccountRepository";
import { InsufficientFundsError } from "../../../../../domain/errors/InsufficientFundsError";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { InsufficientStockQuantityError } from "../../../../../domain/errors/InsufficientStockQuantityError";

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
    private readonly clientRepository: ClientRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly orderMatchingService: OrderMatchingService
  ){}

  async execute({userIdentifier, stockIdentifier, quantity, orderType}: PlaceOrderRequest): Promise<Result<Order, Error>> {
    const clientResult = await this.clientRepository.findByUserId(userIdentifier);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value;

    const stockResult = await this.stockRepository.findById(stockIdentifier);
    if(!stockResult.ok) return err(stockResult.error);

    const stock = stockResult.value;

    let savedOrder: Order;

    const orderIdentifier = randomUUID();

    if(orderType === "BUY"){
      const totalCost = (stock.price * quantity + ORDER_FEES) * 100 // total cost in cents

      const clientBankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(client.clientIdentifier)
      if(!clientBankAccountResult.ok) return err(clientBankAccountResult.error);

      const clientBankAccount = clientBankAccountResult.value;

      if(!clientBankAccount.checkBalance(totalCost)) return err(new InsufficientFundsError(clientBankAccount.accountIdentifier))

      clientBankAccount.withdraw(totalCost) // money withdrawn but reserved
      //créer une transaction et savoir vers où va l'argent

      const newOrder = Order.create({
        orderIdentifier,
        stockIdentifier,
        clientIdentifier: client.clientIdentifier,
        quantity,
        orderType,
        blockedMoneyAmount: totalCost,
        limitPrice: stock.price, // Prix du marché au moment de la commande
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
        quantity,
        orderType,
        blockedStockQuantity: quantity,
        limitPrice: stock.price, // Prix du marché au moment de la commande
        createdAt: new Date()
      });

      const savedOrderResult = await this.orderRepository.save(newOrder);
      if(!savedOrderResult.ok) return err(savedOrderResult.error);

      const updatedPortfolioResult = await this.portfolioRepository.save(sellClientPortfolio);
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