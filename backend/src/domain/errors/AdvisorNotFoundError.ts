export class AdvisorNotFoundError extends Error{
  constructor(message: string){
    super(message);
    this.name = "AdvisorNotFoundError"
  }
}