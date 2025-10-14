export class CouldNotCreateStockError extends Error{
  constructor(){
    super();
    this.name = "CouldNotCreateErrorStock";
  }
}