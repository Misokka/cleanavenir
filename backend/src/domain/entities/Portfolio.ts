import { Holding } from "./Holding";

export class Portfolio {
  constructor(
    public readonly portfolioIdentifier: string,
    public readonly clientId: string,
    public holdings: Holding[] // Les positions du client
  ) {}
}