
import { randomUUID } from "crypto";
import { Portfolio } from "../../../../../domain/entities/Portfolio";
import Result, { err } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { CreatePortfolioRequest } from "./requests/createPortfolioRequest";

export class CreatePortfolioUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly protfolioRepository: PortfolioRepository
  ){}

  async execute({clientIdentifier}: CreatePortfolioRequest): Promise<Result<Portfolio, Error>>{
    const clientResult = await this.clientRepository.findById(clientIdentifier);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const portfolioExistsResult = await this.protfolioRepository.findByClientId(clientIdentifier);
    if(portfolioExistsResult.ok){
      return err(new Error("Portfolio already exists for this client"));
    }

    const portfolioIdentifier = randomUUID();
    const newPortfolio = Portfolio.create({
      portfolioIdentifier,
      clientIdentifier,
    });

    const saveResult = await this.protfolioRepository.save(newPortfolio);
    if(!saveResult.ok){
      return err(saveResult.error);
    }

    return Result.ok(saveResult.value);
  }
}