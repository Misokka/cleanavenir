export class CouldNotDeleteBankAccountError extends Error{
  constructor(accountIdentifier: string){
    super(accountIdentifier);
    this.name = "CouldNotDeleteBankAccountError"
  }
}