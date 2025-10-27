export class PortfolioNotFoundError extends Error {
  constructor(portfolioId: string) {
    super(`Portfolio with ID ${portfolioId} not found.`);
    this.name = "PortfolioNotFoundError";
  }
}