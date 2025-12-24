import { randomUUID } from "crypto";
import { Holding } from "./Holding";

export class Portfolio {
  private constructor(
    public readonly portfolioIdentifier: string,
    public readonly clientIdentifier: string,
    public createdAt: Date,
    private holdings: Map<string, Holding> = new Map(),
  ) {}

  public static create({portfolioIdentifier, clientIdentifier, createdAt, holdings = new Map()}: {
    portfolioIdentifier: string,
    clientIdentifier: string,
    createdAt: Date,
    holdings?: Map<string, Holding>
  }): Portfolio {
    return new Portfolio(portfolioIdentifier, clientIdentifier, createdAt, holdings);
  }

  // Ajoute des actions au portefeuille
  public addHolding(stockIdentifier: string, quantity: number): void {
    const holding = this.holdings.has(stockIdentifier)
    if (!holding) {
      const holdingIdentifier = randomUUID();
      
      this.holdings.set(stockIdentifier, Holding.create({holdingIdentifier, stockIdentifier, portfolioIdentifier: this.portfolioIdentifier, quantity}));
    } else {
      this.holdings.get(stockIdentifier)!.quantity += quantity;
    }
  }

  // Retire des actions du portefeuille (après une vente)
  public removeHolding(stockIdentifier: string, quantity: number): void {
    const holding = this.holdings.get(stockIdentifier);
    if(!holding || holding.quantity < quantity) {
      throw new Error("Not enough holdings to remove");
    } else {
      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        this.holdings.delete(stockIdentifier);
      }
    }
  }

  getHolding(stockIdentifier: string): Holding | undefined {
    return this.holdings.get(stockIdentifier);
  }
}