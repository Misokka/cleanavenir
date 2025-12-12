import { Ticker } from "../value-objects/Ticker";

export class Stock{
  private constructor(
    public readonly stockIdentifier: string,
    public readonly companyIdentifier: string,
    public ticker: Ticker, // Symbole boursier, ex: "AAPL"
    public price: number ,
    public isAvailable: boolean = true,
  ) {}

  public static create({stockIdentifier, companyIdentifier, ticker, price, isAvailable = true}: {
    stockIdentifier: string,
    companyIdentifier: string,
    ticker: Ticker,
    price: number,
    isAvailable?: boolean
  }): Stock {
    return new Stock(stockIdentifier, companyIdentifier, ticker, price, isAvailable);
  }

  public updatePrice(newPrice: number): void {
    this.price = newPrice;
  }
}