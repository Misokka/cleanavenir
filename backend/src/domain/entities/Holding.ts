export class Holding{
  private constructor(
    public readonly holdingIdentifier: string,
    public readonly stockIdentifier: string,
    public portfolioIdentifier: string,
    public quantity: number,
    public averagePrice: number
  ) {}

  public static create({holdingIdentifier, stockIdentifier, portfolioIdentifier, quantity, averagePrice}: {
    holdingIdentifier: string;
    stockIdentifier: string;
    portfolioIdentifier: string;
    quantity: number;
    averagePrice: number;
  }): Holding {
    return new Holding(
      holdingIdentifier,
      stockIdentifier,
      portfolioIdentifier,
      quantity,
      averagePrice
    );
  }
}