export class SavingProductNotFoundError extends Error {
  constructor(savingProductIdentifier: string){
    super(savingProductIdentifier);
    this.name = "SavingProductNotFoundError"
  }
}