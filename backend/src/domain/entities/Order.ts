export type OrderType = "BUY" | "SELL";
export type OrderStatus = "OPEN" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED";

export class Order {
  public remainingQuantity: number;
  constructor(
    public readonly orderIdentifier: string,
    public readonly portfolioIdentifier: string,
    public readonly stockIdentifier: string,
    public readonly type: OrderType,
    public readonly initialQuantity: number,
    public readonly limitPrice: number, // Le prix maximum (pour un BUY) ou minimum (pour un SELL)
    public status: OrderStatus = "OPEN",
  ) {
    this.remainingQuantity = initialQuantity;
  }
}