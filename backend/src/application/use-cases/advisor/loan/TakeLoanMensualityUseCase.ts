import { err } from "../../../../shared/Result";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { LoanRepository } from "../../../ports/repositories/LoanRepository";

export class TakeLoanMensualityUseCase{
  constructor(
    private clientRepository: ClientRepository,
    private loanRepository: LoanRepository,
  ){}

  public async execute(clientIdentifier: string, loanIdentifier: string){
    const client = await this.clientRepository.findById(clientIdentifier);
    if(!client.ok){
      return err(client.error);
    }
    const trueClient = client.value;

    const loan = await this.loanRepository.findById(loanIdentifier);
    if(!loan.ok){
      return err(loan.error);
    }
    const trueLoan = loan.value;

    const loanCreatedAt = trueLoan.createdAt;
    const remainingAmountToPay = trueLoan.remainingAmoutToPay;




  }
}