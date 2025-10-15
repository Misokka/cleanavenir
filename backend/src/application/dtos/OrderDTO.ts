import { OrderStatus, OrderType } from "../../domain/entities/Order";

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