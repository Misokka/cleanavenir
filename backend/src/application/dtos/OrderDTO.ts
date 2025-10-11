export type OrderType = "BUY" | "SELL";
export type OrderStatus = "PENDING" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED";

export type OrderDTO = {
  id: string;
  stockId: string;
  userId: string;        
  type: OrderType;    
  quantity: number;   
  limitPrice: number;  
  fees: number;         
  status: OrderStatus;
  createdAt: string;    
  updatedAt: string;    
}