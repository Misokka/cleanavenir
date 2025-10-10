export type OperationDTO = {
  id: string;
  compteId: string;
  kind: "CREDIT" | "DEBIT";
  amount: number;   
  currency: string; 
  label: string;      
  createdAt: string;  
};