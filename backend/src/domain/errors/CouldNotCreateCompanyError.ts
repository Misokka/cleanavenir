export class CouldNotCreateCompanyError extends Error{
  constructor(){
    super();
    this.name = "CouldNotCreateCompanyError";
  }
}