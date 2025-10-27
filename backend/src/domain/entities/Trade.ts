export class Trade {
  public status: "PENDING_SETTLEMENT" | "SETTLED" = "PENDING_SETTLEMENT";
  
  constructor(
    public readonly id: string,
    public readonly stockId: string,
    public readonly buyOrderId: string,
    public readonly sellOrderId: string,
    public readonly quantity: number,
    public readonly price: number, // Le prix où l'échange s'est fait
    public readonly timestamp: Date = new Date()
  ) {}
}