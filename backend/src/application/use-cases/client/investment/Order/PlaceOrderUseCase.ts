import { randomUUID } from "crypto";
import Result, { err } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { OrderRepository } from "../../../../ports/repositories/OrderRepository";
import { StockRepository } from "../../../../ports/repositories/StockRepository";
import { PlaceOrderRequest } from "./requests/PlaceOrderRequest";
import { Order } from "../../../../../domain/entities/Order";
import { OrderMatchingService } from "../../../../ports/services/OrderMatchingService";

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly stockRepository: StockRepository,
    private readonly clientRepository: ClientRepository,
    private readonly orderMatchingService: OrderMatchingService
  ){}

  async execute({clientIdentifier, stockIdentifier, quantity, orderType,}: PlaceOrderRequest): Promise<Result<Order, Error>> {
    const clientResult = await this.clientRepository.findById(clientIdentifier);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const stockResult = await this.stockRepository.findById(stockIdentifier);
    if(!stockResult.ok){
      return err(stockResult.error);
    }

    const orderIdentifier = randomUUID();
    const newOrder = Order.create({
      orderIdentifier,
      stockIdentifier,
      clientIdentifier,
      quantity,
      orderType,
      limitPrice: stockResult.value.price, // Prix du marché au moment de la commande
    });

    const savedOrderResult = await this.orderRepository.save(newOrder);
    if(!savedOrderResult.ok){
      return err(savedOrderResult.error);
    }

    const matchResult = await this.orderMatchingService.match(stockIdentifier); // ajoute l'ordre à la liste des ordres pour faire varier le prix de l'action
    if(!matchResult.ok){
      return err(matchResult.error);
    }

    return Result.ok(savedOrderResult.value);
  }
}