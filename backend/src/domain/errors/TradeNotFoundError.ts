export class TradeNotFoundError extends Error {
  constructor(tradeIdentifier: string){
    super(tradeIdentifier);
    this.name = 'TradeNotFoundError'
  }
}