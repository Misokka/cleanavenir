import { $Enums, PrismaClient } from "@prisma/client";
import { OrderRepository } from "../../../application/ports/repositories/OrderRepository";
import { Order, OrderStatus } from "../../../domain/entities/Order";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";
import Result, { err, ok } from "../../../shared/Result";
import { PrismaOrderMapper } from "../mappers/PrismaMappers/PrismaOrderMapper";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";

export class PrismaOrderRepository implements OrderRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly prismaOrderMapper: PrismaOrderMapper
  ){}

  async save(order: Order): Promise<Result<Order, Error>> {
    try{
      const orderToPerist = this.prismaOrderMapper.toPersistence(order);
      const registeredOrder = await this.prismaClient.order.create({
        data: orderToPerist
      });
      const orderToDomain = this.prismaOrderMapper.toDomain(registeredOrder);
      return ok(orderToDomain);
    } catch {
      return err(new Error(`An errr occured when saving order: ${order.orderIdentifier}`));
    }
  }

  async findById(orderIdentifier: string): Promise<Result<Order, OrderNotFoundError>> {
    try{
      const order = await this.prismaClient.order.findUnique({
        where: {orderIdentifier}
      });

      if(!order){
        return err(new OrderNotFoundError(orderIdentifier));
      }

      const orderToDomain = this.prismaOrderMapper.toDomain(order);
      return ok(orderToDomain);
    } catch {
      return err(new Error(`An error occured when retrieving order: ${orderIdentifier} `))
    }
  }

  async listByUser(clientIdentifier: string): Promise<Result<Order[], Error>> {
    try{
      const allClientOrders = await this.prismaClient.order.findMany({
        where: {clientIdentifier}
      });
      const allOrdersToDomain = allClientOrders.map((order) => {
        return this.prismaOrderMapper.toDomain(order);
      });

      return ok(allOrdersToDomain);
    } catch {
      return err(new Error(`An error occured when retrieving orders for client: ${clientIdentifier}`));
    }
  }

  async listPendingBuysByStock(stockIdentifier: string): Promise<Result<Order[], Error>> {
    try{
      const allPendingBuyOrders = await this.prismaClient.order.findMany({
        where: {
          stockIdentifier,
          orderType: "BUY"
        }
      });

      const allOrdersToDomain = allPendingBuyOrders.map((order) => {
        return this.prismaOrderMapper.toDomain(order);
      });
      return ok(allOrdersToDomain);
    } catch {
      return err(new Error(`An error occured when retrieving 'BUY' orders for stock: ${stockIdentifier}`))
    }
  }

  async listPendingSellsByStock(stockIdentifier: string): Promise<Result<Order[], Error>> {
    try{
      const allPendingBuyOrders = await this.prismaClient.order.findMany({
        where: {
          stockIdentifier,
          orderType: "SELL"
        }
      });

      const allOrdersToDomain = allPendingBuyOrders.map((order) => {
        return this.prismaOrderMapper.toDomain(order);
      });
      return ok(allOrdersToDomain);
    } catch {
      return err(new Error(`An error occured when retrieving 'SELL' orders for stock: ${stockIdentifier}`))
    }
  }

  async setStatus(orderIdentifier: string, status: OrderStatus): Promise<Result<Order, Error>> {
    try{
      const updatedOrder = await this.prismaClient.order.update({
        data: {status},
        where: {orderIdentifier}
      });
      const updatedOrderToDomain = this.prismaOrderMapper.toDomain(updatedOrder);
      return ok(updatedOrderToDomain);
    } catch {
      return err(new Error(`An error occured when updating order ${orderIdentifier} status.`))
    }
  }
}