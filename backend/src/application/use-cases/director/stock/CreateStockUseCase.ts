import { randomUUID } from "crypto";
import { Stock } from "../../../../domain/entities/Stock";
import { StockRepository } from "../../../ports/repositories/StockRepository";
import { Ticker } from "../../../../domain/value-objects/Ticker";
import Result, { err, ok } from "../../../../shared/Result";
import { CouldNotCreateStockError } from "../../../../domain/errors/CouldNotCreateStockError";
import { CompanyRepository } from "../../../ports/repositories/CompanyRepository";
import { PortfolioRepository } from "../../../ports/repositories/PortfolioRepository";
import { Portfolio } from "../../../../domain/entities/Portfolio";
import { SYSTEM_PORTFOLIO_ID } from "../../../../shared/constants/Investment";
import { OrderRepository } from "../../../ports/repositories/OrderRepository";
import { Order } from "../../../../domain/entities/Order";
import { UserRepository } from "../../../ports/repositories/UserRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";

type CreateStockProps = {
  companyIdentifier: string,
  tickerValue: string,
  price: number,
  isAvailable: boolean,
  initialQuantity: number
}
export class CreateStockUseCase{
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly orderRepository: OrderRepository,
  ){}

  public async execute({companyIdentifier, tickerValue, price, isAvailable, initialQuantity}: CreateStockProps): Promise<Result<Stock, Error>>{
    const existingCompanyResult = await this.companyRepository.findById(companyIdentifier);

    if(!existingCompanyResult.ok){
      return err(existingCompanyResult.error)
    }

    // vérifier si l'entreprise n'a pas déja d'action en circulation

    const ticker = Ticker.from(tickerValue);
    if(!ticker.ok){
      return err(ticker.error)
    }

    const stockIdentifier = randomUUID();
    const newStock = Stock.create({
      stockIdentifier,
      companyIdentifier,
      price,
      ticker: ticker.value,
      isAvailable,
      createdAt: new Date()
    });

    const maybeStock = await this.stockRepository.save(newStock);

    if(!maybeStock.ok){
      console.error('CreateStockUseCase - Stock save error:', maybeStock.error);
      return err(new CouldNotCreateStockError())
    }
    const stock = maybeStock.value;

    const systemUserResult = await this.userRepository.getSystemUser();
    if(!systemUserResult.ok) return err(systemUserResult.error);
    const systemUser = systemUserResult.value;

    const systemClientResult = await this.clientRepository.getSystemClient(systemUser.userIdentifier);
    if(!systemClientResult.ok) return err(systemClientResult.error);
    const systemClient = systemClientResult.value;

    const systemPortfolioResult = await this.portfolioRepository.findByClientId(systemClient.clientIdentifier);
    if(!systemPortfolioResult.ok) return err(systemPortfolioResult.error);
    const systemPortfolio = systemPortfolioResult.value;

    const systemSellOrder = Order.create({
      orderIdentifier: randomUUID(),
      clientIdentifier: systemClient.clientIdentifier,
      stockIdentifier:stock.stockIdentifier,
      limitPrice: stock.price * 100,
      orderType: "SELL",
      initialQuantity: initialQuantity,
      remainingQuantity: initialQuantity,
      blockedStockQuantity: initialQuantity,
      sellerHoldingAveragePrice: stock.price * 100,
      createdAt: new Date()
    });

    const savedOrderResult = await this.orderRepository.save(systemSellOrder);
    if(!savedOrderResult.ok) return err(savedOrderResult.error);

    return ok(maybeStock.value)
  }
}