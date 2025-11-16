export class TransactionNotFoundError extends Error{
  constructor(transactionIdentifier: string){
    super(transactionIdentifier);
    this.name = "TransactionNotFoundError"
  }
}