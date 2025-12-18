export class CompanyNotFoundError extends Error {
  constructor(companyIdentifier: string){
    super(companyIdentifier);
    this.name = 'CompanyNotFoundError'
  }
}