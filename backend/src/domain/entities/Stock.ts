import { Ticker } from "../value-objects/Ticker";

export class Stock{
  constructor(
    public readonly stockIdentifier: string,
    public readonly companyIdentifier: string,
    public ticker: Ticker, // Symbole boursier, ex: "AAPL"
    public isAvailable: boolean = true
  ) {}
}