export type TransactionType = 
  | "TRANSFER" 
  | "LOAN_PAYMENT" 
  | "LOAN_DISBURSEMENT"
  | "STOCK_PURCHASE" 
  | "STOCK_SALE"
  | "SAVINGS_INTEREST"
  | "INITIAL_DEPOSIT";

export type TransactionDirection = "DEBIT" | "CREDIT";

export class Transaction {
  private constructor(
    public readonly transactionIdentifier: string,
    public readonly bankAccountIdentifier: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly direction: TransactionDirection,
    public readonly type: TransactionType,
    public readonly description: string,
    public readonly createdAt: Date = new Date(),
    public readonly fromAccountIdentifier?: string,
    public readonly toAccountIdentifier?: string,
    public readonly toSavingAccountIdentifier?: string
  ) {}

  static create(props: {
    transactionIdentifier: string;
    bankAccountIdentifier: string;
    amount: number;
    currency: string;
    direction: TransactionDirection;
    type: TransactionType;
    description: string;
    createdAt?: Date;
    fromAccountIdentifier?: string,
    toAccountIdentifier?: string,
    toSavingAccountIdentifier?: string
  }): Transaction {
    return new Transaction(
      props.transactionIdentifier,
      props.bankAccountIdentifier,
      props.amount,
      props.currency,
      props.direction,
      props.type,
      props.description,
      props.createdAt || new Date(),
      props.fromAccountIdentifier,
      props.toAccountIdentifier,
      props.toSavingAccountIdentifier
    );
  }
}