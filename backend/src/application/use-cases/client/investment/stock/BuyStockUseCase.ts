import { OrderType } from "../../../../../domain/entities/Order";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { HoldingRepository } from "../../../../ports/repositories/HoldingRepository";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";

export class BuyStockUseCase{
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly stockRepository: StockRepository,
    private readonly orderRepository: OrderRepository,
    private readonly holdingRepository: HoldingRepository,
    private readonly portfolioRepository: PortfolioRepository,
  ){}

  public async execute(
    stockIdentifier: string,
    userIdentifier: string,
    quantity: number, 
    type: OrderType = "BUY"
  ){
    await this.orderRepository.save(stockIdentifier, userIdentifier, type, quantity)
    

  }

  // Créer plusieurs fonction pour gérer les différentes étapes d'achat d'action
}