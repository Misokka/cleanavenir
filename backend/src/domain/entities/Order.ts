export type OrderType = "BUY" | "SELL";
export type OrderStatus = "PENDING" | "PARTIALLY_FILLED" | "EXECUTED" | "CANCELLED";

export class Order {
  private constructor(
    public readonly orderIdentifier: string,
    public readonly stockIdentifier: string,
    public readonly clientIdentifier: string,
    public readonly orderType: OrderType,
    public initialQuantity: number,
    public remainingQuantity: number,
    public readonly limitPrice: number, // Le prix maximum (pour un BUY) ou minimum (pour un SELL)
    public status: OrderStatus = "PENDING",
    public createdAt: Date,
    public blockedMoneyAmount?: number,
    public blockedStockQuantity?: number
  ) {}

  public static create({orderIdentifier, stockIdentifier, clientIdentifier, orderType, initialQuantity, remainingQuantity, limitPrice, createdAt, status = "PENDING", blockedMoneyAmount, blockedStockQuantity}: {
    orderIdentifier: string,
    stockIdentifier: string,
    clientIdentifier: string,
    orderType: OrderType,
    initialQuantity: number,
    remainingQuantity: number
    limitPrice: number,
    createdAt: Date
    status?: OrderStatus,
    blockedMoneyAmount?: number,
    blockedStockQuantity?: number
  }): Order {
    return new Order(orderIdentifier, stockIdentifier, clientIdentifier, orderType, initialQuantity, remainingQuantity, limitPrice, status, createdAt, blockedMoneyAmount, blockedStockQuantity);
  }
}