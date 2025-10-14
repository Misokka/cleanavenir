export class Holding{
  constructor(
    public readonly portfolioId: string,
    public readonly stockId: string,
    public quantity: number
  ) {}
}