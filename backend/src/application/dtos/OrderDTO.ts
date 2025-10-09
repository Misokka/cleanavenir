export type OrderSide = "BUY" | "SELL";
export type OrderStatus = "PENDING" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED";

export type OrderDTO = {
  id: string;
  actionId: string;
  userId: string;        
  side: OrderSide;    
  quantity: number;   
  limitPrice: number;  
  fees: number;         
  status: OrderStatus;
  createdAt: string;    
  updatedAt: string;    
}