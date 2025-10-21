export class InvalidSavingProductLabelError extends Error{
  constructor(message: string){
    super(message);
    this.name = "InvalidSavingProductLabelError";
  }
}