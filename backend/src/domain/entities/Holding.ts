export class Holding{
  constructor(
    public readonly portfolioIdentifier: string,
    public readonly stockIdentifier: string,
    public quantity: number
  ) {}
}