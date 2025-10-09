export type OperationDTO = {
  id: string;
  AccountId: string;
  kind: "CREDIT" | "DEBIT";
  amount: number;   
  currency: string; 
  label: string;      
  createdAt: string;  
};