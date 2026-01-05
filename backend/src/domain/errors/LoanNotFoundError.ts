export class LoanNotFoundError extends Error{
  constructor(loanIdentifier: string){
    super(`Le prêt avec l'identifiant ${loanIdentifier} est introuvable`);
    this.name = "LoanNotFoundError"
  }
}