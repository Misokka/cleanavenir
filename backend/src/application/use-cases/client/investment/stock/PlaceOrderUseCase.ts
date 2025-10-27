import { randomUUID } from "crypto";
import { Order, OrderType } from "../../../../../domain/entities/Order";
import { err, ok, Result } from "../../../../../shared/Result";
import { BankAccountRepository } from "../../../../ports/repositories/BankAccountRepository";
import { OrderBookRepository } from "../../../../ports/repositories/OrderBookRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { TradeRepository } from "../../../../ports/repositories/TradeRepository";
import { InsufficientFundsError } from "../../../../../domain/errors/InsufficientFundsError";


export class PlaceOrderUseCase {
  constructor(
    private readonly orderBookRepository: OrderBookRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly tradeRepository: TradeRepository
  ) {}

  async execute(clientIdentifier: string, stockIdentifier: string, type: OrderType, quantity: number, limitPrice: number): Promise<Result<boolean, Error>> {
    const portfolio = await this.portfolioRepository.findByClientId(clientIdentifier);
    if(!portfolio.ok){
      return err(portfolio.error)
    }

    const bankAccount = await this.bankAccountRepository.findDefaultAccountByClientId(clientIdentifier);
    if(!bankAccount.ok){
      return err(bankAccount.error)
    }

    const orderCost = quantity * limitPrice;
    if(!bankAccount.value.checkBalance(orderCost)){
      return err(new InsufficientFundsError(bankAccount.value.accountIdentifier));
    }

    const orderIdentifier = randomUUID();
    const newOrder = new Order(orderIdentifier, portfolio.value.portfolioIdentifier, stockIdentifier, type, quantity, limitPrice);

    const orderBook = await this.orderBookRepository.findByStockId(stockIdentifier);
    if(!orderBook.ok){
      return err(orderBook.error)
    }

    const trades = orderBook.value.addOrder(newOrder);

    
    await this.bankAccountRepository.save(bankAccount.value);
    await this.portfolioRepository.save(portfolio.value);
    await this.orderBookRepository.save(orderBook.value);
    await this.tradeRepository.saveAll(trades);

    return ok(true);
  }
}