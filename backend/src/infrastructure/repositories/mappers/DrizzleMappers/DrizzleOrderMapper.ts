import { Order, OrderStatus, OrderType } from "../../../../domain/entities/Order";
import { OrderDrizzle, NewOrderDrizzle } from "../../../drizzle/schema";
import { Mapper } from "../MapperInterface";

export class DrizzleOrderMapper implements Mapper<OrderDrizzle, Order, NewOrderDrizzle> {
  toDomain(raw: OrderDrizzle): Order {
    return Order.create({
      ...raw,
      orderIdentifier: raw.id,
      clientIdentifier: raw.ownerId,
      stockIdentifier: raw.stockId,
      orderType: raw.type as OrderType,
      limitPrice: raw.price,
      status: raw.status as OrderStatus,
      createdAt: new Date(raw.createdAt)
    }) ;
  }

  toPersistence(entity: Order): NewOrderDrizzle {
    return {
      ...entity,
      id: entity.orderIdentifier,
      ownerId: entity.clientIdentifier,
      stockId: entity.stockIdentifier,
      type: entity.orderType,
      price: entity.limitPrice,
      status: entity.status,
      createdAt: entity.createdAt.toISOString()
    };
  }
}
