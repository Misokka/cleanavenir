export type TransactionDTO = {
  id: string;
  accountId: string;
  kind: "CREDIT" | "DEBIT";
  amount: number;   
  currency: string; 
  label: string;      
  createdAt: string;  
};