export class SavingProductAlreadyExistsError extends Error{
  constructor(message: string){
    super(message);
    this.name = "SavingProductAlreadyExistsError";
  }
}