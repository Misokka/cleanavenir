export class LoanNotFoundError extends Error{
  constructor(loanIdentifier: string){
    super(loanIdentifier);
    this.name = "LoanNotFoundError"
  }
}