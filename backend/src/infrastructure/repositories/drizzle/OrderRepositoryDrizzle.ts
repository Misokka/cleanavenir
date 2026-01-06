import { and, asc, desc, eq, or } from 'drizzle-orm';
import { orders } from '../../drizzle/schema';
import Result, { ok, err } from '../../../shared/Result';
import { DrizzleClient } from '../../drizzle/client';
import { OrderRepository } from '../../../application/ports/repositories/OrderRepository';
import { DrizzleOrderMapper } from '../mappers/DrizzleMappers/DrizzleOrderMapper';
import { Order, OrderStatus } from '../../../domain/entities/Order';
import { OrderNotFoundError } from '../../../domain/errors/OrderNotFoundError';

export class OrderRepositoryDrizzle implements OrderRepository{
  constructor(
    private db: DrizzleClient,
    private orderMapper: DrizzleOrderMapper
  ) {}

  async save(order: Order): Promise<Result<Order, Error>> {
    try {
      const orderToPersist = this.orderMapper.toPersistence(order);
      const registeredOrderRows = await this.db.insert(orders).values(orderToPersist).returning();
      const orderToDomain = this.orderMapper.toDomain(registeredOrderRows[0]);
      return ok(orderToDomain);
    } catch (e: any) {
      return err(new Error(`Could not insert order: ${e.message}`));
    }
  }

  async update(order: Order): Promise<Result<Order, Error>> {
    try{
      const orderToPersist = this.orderMapper.toPersistence(order);
      const updatedOrderRows = await this.db.update(orders).set(orderToPersist).where(eq(orders.id, order.orderIdentifier)).returning();
      const toDomain = this.orderMapper.toDomain(updatedOrderRows[0]);
      return ok(toDomain);
    } catch (error: any) {
      return err(new Error(`Couldn't update order ${order.orderIdentifier} message: ${error.message}`))
    }
  }

  async findById(id: string): Promise<Result<Order, OrderNotFoundError>> {
    try {
      const row = await this.db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if(!row.length) return err(new OrderNotFoundError(id));

      const orderToDomain = this.orderMapper.toDomain(row[0])
      return ok(orderToDomain);
    } catch (e: any) {
      return err(new Error(`Could not find order by id: ${id}`));
    }
  }

  async listByUser(clientIdentifier: string): Promise<Result<Order[], Error>> {
    try{
      const clientOrderRows = await this.db.select().from(orders).where(eq(orders.ownerId, clientIdentifier));
      const ordersToDomain = clientOrderRows.map((row) => {
        return this.orderMapper.toDomain(row);
      });

      return ok(ordersToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving orders for client: ${clientIdentifier}`))
    }
  }

  async listPendingBuysByStock(stockIdentifier: string): Promise<Result<Order[], Error>> {
    try{
      const buyOrderRows = await this.db.select().from(orders)
      .where(
        and(
          eq(orders.stockId, stockIdentifier), eq(orders.type, "BUY"),
          and(
            or(eq(orders.status, "PENDING"), eq(orders.status, "PARTIALLY_FILLED"))
          )
        )
      )
      .orderBy(desc(orders.limitPrice), asc(orders.createdAt));
      const ordersToDomain = buyOrderRows.map((row) => {
        return this.orderMapper.toDomain(row);
      });

      return ok(ordersToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving orders for stock: ${stockIdentifier}`))
    }
  }

  async listPendingSellsByStock(stockIdentifier: string): Promise<Result<Order[], Error>> {
    try{
      const sellOrderRows = await this.db.select().from(orders)
      .where(
        and(
          eq(orders.stockId, stockIdentifier), eq(orders.type, "SELL"),
          and(
            or(eq(orders.status, "PENDING"), eq(orders.status, "PARTIALLY_FILLED"))
          )
        )
      )
      .orderBy(asc(orders.limitPrice), asc(orders.createdAt));
      const ordersToDomain = sellOrderRows.map((row) => {
        return this.orderMapper.toDomain(row);
      });

      return ok(ordersToDomain);
    } catch (error) {
      return err(new Error(`An error occured when retrieving orders for stock: ${stockIdentifier}`))
    }
  }

  async setStatus(orderIdentifier: string, status: OrderStatus): Promise<Result<Order, OrderNotFoundError>> {
    try{
      const orderRows = await this.db.select({id: orders.id}).from(orders).where(eq(orders.id, orderIdentifier)).limit(1);
      if(!orderRows.length){
        return err(new OrderNotFoundError(orderIdentifier));
      }

      const updatedOrderRows = await this.db.update(orders).set({status: status}).where(eq(orders.id, orderIdentifier)).returning();
      const orderToDomain = this.orderMapper.toDomain(updatedOrderRows[0]);
      return ok(orderToDomain);
    } catch (error) {
      return err(new Error(`Couldn't set new status for order ${orderIdentifier}`))
    }
  }

  async delete(orderIdentifier: string): Promise<Result<boolean, Error>> {
    try {
      await this.db.delete(orders).where(eq(orders.id, orderIdentifier));
      return ok(true);
    } catch (e: any) {
      return err(new Error(`Could not delete order: ${e.message}`));
    }
  }
}
