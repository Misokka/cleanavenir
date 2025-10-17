export type TransactionType = 
  | "TRANSFER" 
  | "LOAN_PAYMENT" 
  | "STOCK_PURCHASE" 
  | "STOCK_SALE"
  | "SAVINGS_INTEREST"
  | "INITIAL_DEPOSIT";

export type TransactionDirection = "DEBIT" | "CREDIT";

export class Transaction {
  constructor(
    public readonly transactionIdentifier: string,
    public readonly bankAccountIdentifier: string,
    public readonly amount: number,
    public readonly direction: TransactionDirection,
    public readonly type: TransactionType,
    public readonly description: string,
    public readonly date: Date = new Date()
  ) {}
}