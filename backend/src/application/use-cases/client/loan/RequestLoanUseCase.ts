import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../../shared/Result';
import { Loan } from '../../../../domain/entities/Loan';
import { LoanRepository } from '../../../ports/repositories/LoanRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';

export interface RequestLoanInput {
  clientIdentifier: string;
  advisorIdentifier: string;
  amount: number; // en centimes
  durationInMonth: number;
  annualInterestRate: number; // en basis points
  annualInsuranceRate: number; // en basis points
}

export class RequestLoanUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(input: RequestLoanInput): Promise<Result<Loan, Error>> {
    // Vérifier que le client existe
    const clientResult = await this.clientRepository.findById(input.clientIdentifier);
    if (!clientResult.ok) {
      return err(new Error('Client introuvable'));
    }

    // Créer le prêt avec statut "PENDING"

    const loan = Loan.create({
      loanIdentifier: randomUUID(),
      clientIdentifier: input.clientIdentifier,
      advisorIdentifier: input.advisorIdentifier, // advisorId vide car pas encore assigné
      loanAmount: input.amount,
      durationInMonth: input.durationInMonth,
      mensualities: 0, // mensualités calculées par le conseiller lors de l'approbation
      insuranceMensualities: 0, // assurance calculée par le conseiller lors de l'approbation
      remainingAmountToPay: input.amount, // montant restant = montant initial
      annualInterestRate: input.annualInterestRate,
      annualInsuranceRate: input.annualInsuranceRate,
      status: 'PENDING', // statut en attente d'approbation
      createdAt: new Date(),
      lastPaidAt: undefined, // closedAt undefined
      nextToPayAt: undefined // nextPaymentDate undefined tant que non approuvé
    });


    const result = await this.loanRepository.save(loan);

    if (!result.ok) {
      return err(result.error);
    }

    return ok(result.value);
  }
}
