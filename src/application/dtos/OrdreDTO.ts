export type OrdreSide = "BUY" | "SELL";
export type OrdreStatus = "PENDING" | "PARTIALLY_FILLED" | "FILLED" | "CANCELLED";

export type OrdreDTO = {
  id: string;
  actionId: string;
  userId: string;        
  side: OrdreSide;    
  quantity: number;   
  limitPrice: number;  
  fees: number;         
  status: OrdreStatus;
  createdAt: string;    
  updatedAt: string;    
}