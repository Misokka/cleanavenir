export type OrderType = "BUY" | "SELL";
export type OrderStatus = "PENDING" | "EXECUTED" | "CANCELLED";

export class Order{
  constructor(
    public readonly orderIdentifier: string,
    public readonly portfolioId: string,
    public readonly stockId: string,
    public readonly type: OrderType,
    public quantity: number, // Nombre d'actions
    public status: OrderStatus = "PENDING",
    public readonly createdAt: Date = new Date(),
    public executedAt?: Date
  ) {}
}