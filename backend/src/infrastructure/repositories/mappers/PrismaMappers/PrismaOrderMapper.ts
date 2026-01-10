import { Mapper } from "../MapperInterface";
import { OrderStatus, OrderType, Order as PrismaOrder } from "@prisma/client";
import { Order } from "../../../../domain/entities/Order";

type OrderToPersist = {
  orderIdentifier: string;
  stockIdentifier: string;
  clientIdentifier: string;
  orderType: OrderType;
  initialQuantity: number;
  remainingQuantity: number;
  limitPrice: number;
  status: OrderStatus;
  blockedMoneyAmount?: number
  remainingBlockedMoneyAmount?: number
  blockedStckQuantity?: number
  sellerHoldingAveragePrice?: number
  createdAt: Date
}

export class PrismaOrderMapper implements Mapper<PrismaOrder, Order, OrderToPersist> {
  toDomain(raw: PrismaOrder): Order {
    return Order.create({
      ...raw,
      blockedMoneyAmount: raw.blockedMoneyAmount as number | undefined,
      remainingBlockedMoneyAmount: raw.remainingBlockedMoneyAmount as number | undefined,
      blockedStockQuantity: raw.blockedStockQuantity as number | undefined,
      sellerHoldingAveragePrice: raw.sellerHoldingAveragePrice as number | undefined
    })
  }

  toPersistence(obj: Order): OrderToPersist {
    return {
      ...obj
    }
  }
}