import { CompanyDTO } from "./CompanyDTO";

export type StockDTO = {
  id: string;
  ticker: string;
  price: number;
  createdAt: string; 
  updatedAt: string;
  isAvailable: boolean;
  company: CompanyDTO;
}