import { API_ENDPOINTS } from "../endpoints";
import { httpClient } from "../httpClient";

type CreatePortfolioResponse = {
  sucess: boolean,
  message: string
}

export type Portfolio = {
  id: string,
  ownerId: string,
  holdings: Holding[],
  createdAt: string
}

export type Holding = {
  id: string,
  portfolioId: string,
  stockId: string,
  quantity: number
}

export class PortfolioService {
  async createPortfolio(){
    try{
      const response = await httpClient.post<CreatePortfolioResponse>(API_ENDPOINTS.INVESTMENTS.PORTFOLIOS.CREATE);
      return response.data
    } catch (error){
      console.error("Une erreur est survenue lors de la création de votre portfolio", error);
      throw error
    }
  }

  async getMyportfolio(){
    try{
      const response = await httpClient.get<{portfolio: Portfolio}>(API_ENDPOINTS.INVESTMENTS.PORTFOLIOS.MY_PORTFOLIO);
      return response.data
    } catch (error){
      console.error("Une erreur est survenue lors de la récupération de votre portfolio", error);
      throw error
    }
  }
}

export const portfolioService = new PortfolioService();