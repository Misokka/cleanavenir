import { Portfolio } from "../../../../../domain/entities/Portfolio";
import Result, { err, ok } from "../../../../../shared/Result";
import { ClientRepository } from "../../../../ports/repositories/ClientRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";

export class GetMyPortfolioUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly portfolioRepository: PortfolioRepository
  ){}

  async execute({ userId }: { userId: string }): Promise<Result<Portfolio, Error>>{
    const clientResult = await this.clientRepository.findByUserId(userId);
    if(!clientResult.ok){
      return err(clientResult.error);
    }

    const client = clientResult.value;

    const portfolioResult = await this.portfolioRepository.findByClientId(client.clientIdentifier);
    if(!portfolioResult.ok) return err(portfolioResult.error);

    return ok(portfolioResult.value);
  }
}