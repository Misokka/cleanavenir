import { randomUUID } from 'crypto';
import { Result, ok, err } from '../../../../shared/Result';
import { Loan } from '../../../../domain/entities/Loan';
import { LoanRepository } from '../../../ports/repositories/LoanRepository';
import { ClientRepository } from '../../../ports/repositories/ClientRepository';
import { LoanCalculator } from '../../../ports/services/LoanCalculator';

export interface RequestLoanInput {
  clientIdentifier: string;
  amount: number; // en centimes
  durationInMonth: number;
  annualInterestRate: number; // en basis points
  annualInsuranceRate: number; // en basis points
}

export class RequestLoanUseCase {
  private calculator = new LoanCalculator();
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

    const client = clientResult.value;

    const mensualities = this.calculator.getMensualities(
      input.amount,
      input.annualInterestRate,
      input.durationInMonth,
      input.annualInsuranceRate
    )

    const insuranceMensualities = this.calculator.computeInsuranceMensualities(input.amount, input.annualInsuranceRate)

    // Créer le prêt avec statut "PENDING"

    const loan = Loan.create({
      loanIdentifier: randomUUID(),
      clientIdentifier: input.clientIdentifier,
      advisorIdentifier: client.advisorIdentifier, // advisor assigné aléatoirement à la création du compte
      loanAmount: input.amount,
      durationInMonth: input.durationInMonth,
      mensualities: mensualities, // mensualités calculées par le conseiller lors de l'approbation
      insuranceMensualities: insuranceMensualities, // assurance calculée par le conseiller lors de l'approbation
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
