import { Holding } from "./Holding";

export class Portfolio {
  constructor(
    public readonly portfolioIdentifier: string,
    public readonly clientIdentifier: string,
    public holdings: Holding[] // La liste des actions possédées
  ) {}

  // Ajoute des actions au portefeuille
  public addHolding(stockIdentifier: string, quantity: number): void {
    const holding = this.holdings.find(h => h.stockIdentifier === stockIdentifier);
    if (holding) {
      holding.quantity += quantity;
    } else {
      this.holdings.push(new Holding(this.portfolioIdentifier, stockIdentifier, quantity));
    }
  }

  // Retire des actions du portefeuille (après une vente)
  public removeHolding(stockIdentifier: string, quantity: number): void {
    const holding = this.holdings.find(h => h.stockIdentifier === stockIdentifier);
    if (!holding || holding.quantity < quantity) {
      throw new Error("Not enough shares to sell.");
    }
    holding.quantity -= quantity;
    // On peut filtrer pour enlever les lignes à 0
    this.holdings = this.holdings.filter(h => h.quantity > 0);
  }
}