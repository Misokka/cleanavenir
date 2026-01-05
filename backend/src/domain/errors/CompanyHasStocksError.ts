export class CompanyHasStocksError extends Error {
  constructor(companyId: string, stockCount: number) {
    super(
      `Cannot delete company ${companyId} because it has ${stockCount} associated stock(s). Please delete or reassign the stocks first.`
    );
    this.name = 'CompanyHasStocksError';
  }
}
