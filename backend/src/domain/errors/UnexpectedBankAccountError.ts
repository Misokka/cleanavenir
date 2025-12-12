export class UnexpectedBankAccountError extends Error {
  constructor(message: string){
    super(message);
    this.name = "UnexpectedBankAccountError";
  }
}