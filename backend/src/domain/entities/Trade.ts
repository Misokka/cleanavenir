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
    public readonly createdAt: Date = new Date()
  ) {}

  public static create(props: {
    tradeIdentifier: string,
    stockIdentifier: string,
    buyOrderIdentifier: string,
    sellOrderIdentifier: string,
    quantity: number,
    price: number, // Le prix où l'échange s'est fait
    createdAt: Date,
    status?: TradeStatus
  }): Trade{
    return new Trade(
      props.tradeIdentifier,
      props.stockIdentifier,
      props.buyOrderIdentifier,
      props.sellOrderIdentifier,
      props.quantity,
      props.price,
      props.createdAt
    )
  }
}