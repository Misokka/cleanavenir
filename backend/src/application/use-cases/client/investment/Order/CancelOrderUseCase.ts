
import Result, { err, ok } from "../../../../../shared/Result";
import { BankAccountRepository } from "../../../../ports/repositories/BankAccountRepository";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { CancelOrderRequest } from "./requests/CancelOrderRequest";

export class CancelOrderUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly orderRepository: OrderRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly bankAccountRepository: BankAccountRepository
  ){}

  async execute({ userIdentifier, orderIdentifier}: CancelOrderRequest): Promise<Result<boolean, Error>>{
    const clientResult = await this.clientRepository.findByUserId(userIdentifier);
    if(!clientResult.ok) return err(clientResult.error);

    const client = clientResult.value;

    const orderResult = await this.orderRepository.findById(orderIdentifier);
    if(!orderResult.ok) return err(orderResult.error);

    const order = orderResult.value;

    if(order.status === "PENDING"){
      order.status = "CANCELLED";
      const updatedOrderResult = await this.orderRepository.setStatus(order.orderIdentifier, order.status);
      if(!updatedOrderResult.ok) return err(updatedOrderResult.error);
    } else {
      return err(new Error("Cannot cancel this order as it not a pending Order anymore."))
    }

    if(order.orderType === "BUY"){

      const clientBankAccountResult = await this.bankAccountRepository.findDefaultAccountByClientId(client.clientIdentifier);
      if(!clientBankAccountResult.ok) return err(clientBankAccountResult.error);
      const clientBankAccount = clientBankAccountResult.value;

      const reservedFunds = order.blockedMoneyAmount ?? 0;
      clientBankAccount.deposit(reservedFunds);

      const updatedBankAccountResult = await this.bankAccountRepository.updateBalance(clientBankAccount.accountIdentifier, clientBankAccount.balance);
      if(!updatedBankAccountResult.ok) return err(updatedBankAccountResult.error);

    } else if(order.orderType === "SELL"){

      const clientPortfolioResult = await this.portfolioRepository.findByClientId(client.clientIdentifier);
      if(!clientPortfolioResult.ok) return err(clientPortfolioResult.error);
      const clientPortfolio = clientPortfolioResult.value;


      const stockQuantity = order.blockedStockQuantity ?? 0
      
      const holding = clientPortfolio.getHolding(order.stockIdentifier);
      if (!holding) {
          // Cas théoriquement impossible : on ne peut pas annuler une vente d'une action qu'on a plus en portefeuille
          // (sauf si le système a un bug de cohérence).
          return err(new Error("Holding not found for this stock identifier in portfolio"));
      }

      const currentAveragePrice = holding.averagePrice;
      clientPortfolio.addHolding(order.stockIdentifier, stockQuantity, currentAveragePrice);

      const updatedPortfolioResult = await this.portfolioRepository.update(clientPortfolio);
      if(!updatedPortfolioResult.ok) return err(updatedPortfolioResult.error);
    } else {
      return err(new Error("Invalid Order type"));
    }

    return ok(true);
  }
}