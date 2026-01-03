export type TransactionDTO = {
  id: string;
  accountId: string;
  kind: "CREDIT" | "DEBIT";
  type: string;
  amount: number;   
  currency: string; 
  label: string;      
  createdAt: string;
  fromAccountId?: string;
  toAccountId?: string;
};