export class Holding{
  private constructor(
    public readonly holdingIdentifier: string,
    public readonly stockIdentifier: string,
    public portfolioIdentifier: string,
    public quantity: number
  ) {}

  public static create({holdingIdentifier, stockIdentifier, portfolioIdentifier, quantity}: {
    holdingIdentifier: string;
    stockIdentifier: string;
    portfolioIdentifier: string;
    quantity: number;
  }): Holding {
    return new Holding(
      holdingIdentifier,
      stockIdentifier,
      portfolioIdentifier,
      quantity
    );
  }
}