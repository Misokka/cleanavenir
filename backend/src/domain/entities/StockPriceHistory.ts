export class StockPriceHistory {
  private constructor(
    public stockPriceIdentifier: string,
    public stockIdentifier: string,
    public price: number,
    public recordedAt: Date,
  ) {}

  public static create(props: {
    stockPriceIdentifier: string,
    stockIdentifier: string,
    price: number,
    recordedAt: Date,
  }
  ): StockPriceHistory {
    return new StockPriceHistory(
      props.stockPriceIdentifier,
      props.stockIdentifier,
      props.price,
      props.recordedAt,
    );
  }
}