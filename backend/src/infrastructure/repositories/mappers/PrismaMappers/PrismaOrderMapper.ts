import { Mapper } from "../MapperInterface";
import { OrderStatus, OrderType, Prisma, Order as PrismaOrder } from "@prisma/client";
import { Order } from "../../../../domain/entities/Order";

type OrderToPersist = {
  orderIdentifier: string;
  stockIdentifier: string;
  clientIdentifier: string;
  orderType: OrderType;
  quantity: number;
  limitPrice: number;
  status: OrderStatus;
}

export class PrismaOrderMapper implements Mapper<PrismaOrder, Order, OrderToPersist> {
  toDomain(raw: PrismaOrder): Order {
    return Order.create({
      ...raw
    })
  }

  toPersistence(obj: Order): OrderToPersist {
    return {
      ...obj
    }
  }
}