export type TradeStatus = "PENDING_SETTLEMENT" | "SETTLED"
export class Trade {
  public status: TradeStatus = "PENDING_SETTLEMENT";
  
  constructor(
    public readonly tradeIdentifier: string,
    public readonly stockIdentifier: string,
    public readonly buyOrderIdentifier: string,
    public readonly sellOrderIdentifier: string,
    public readonly quantity: number,
    public readonly price: number, // Le prix où l'échange s'est fait
    public readonly timestamp: Date = new Date()
  ) {}
}