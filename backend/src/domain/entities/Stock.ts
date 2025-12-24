import { Ticker } from "../value-objects/Ticker";

export class Stock{
  public updatedAt: Date | null = null;
  private constructor(
    public readonly stockIdentifier: string,
    public readonly companyIdentifier: string,
    public ticker: Ticker, // Symbole boursier, ex: "AAPL"
    public price: number ,
    public isAvailable: boolean = true,
    public createdAt: Date
  ) {}

  public static create({stockIdentifier, companyIdentifier, ticker, price, isAvailable = true, createdAt}: {
    stockIdentifier: string,
    companyIdentifier: string,
    ticker: Ticker,
    price: number,
    isAvailable?: boolean,
    createdAt: Date
  }): Stock {
    return new Stock(stockIdentifier, companyIdentifier, ticker, price, isAvailable, createdAt);
  }

  public updatePrice(newPrice: number): void {
    this.price = newPrice;
  }
}