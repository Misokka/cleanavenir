
import { randomUUID } from "crypto";
import { Portfolio } from "../../../../../domain/entities/Portfolio";
import Result, { err } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { CreatePortfolioRequest } from "./requests/createPortfolioRequest";

export class CreatePortfolioUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly portfolioRepository: PortfolioRepository
  ){}

  async execute({userId}: CreatePortfolioRequest): Promise<Result<Portfolio, Error>>{
    const clientResult = await this.clientRepository.findByUserId(userId);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value;

    const portfolioExistsResult = await this.portfolioRepository.findByClientId(client.clientIdentifier);
    if(portfolioExistsResult.ok){
      return err(new Error("Portfolio already exists for this client"));
    }

    const portfolioIdentifier = randomUUID();
    const newPortfolio = Portfolio.create({
      portfolioIdentifier,
      clientIdentifier: client.clientIdentifier,
      createdAt: new Date()
    });

    const saveResult = await this.portfolioRepository.save(newPortfolio);
    if(!saveResult.ok){
      return err(saveResult.error);
    }

    return Result.ok(saveResult.value);
  }
}