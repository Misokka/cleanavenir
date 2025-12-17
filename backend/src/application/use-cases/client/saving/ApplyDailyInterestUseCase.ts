import { err, ok, Result } from "../../../../shared/Result";
import { SavingRepositoryDrizzle } from "../../../../infrastructure/repositories/drizzle/SavingRepositoryDrizzle";
import { OperationRepositoryDrizzle } from "../../../../infrastructure/repositories/drizzle/TransactionRepositoryDrizzle";
import { randomUUID } from "node:crypto";

export class ApplyDailyInterestUseCase {
  constructor(
    private readonly savingRepository: SavingRepositoryDrizzle,
    private readonly operationRepository: OperationRepositoryDrizzle
  ) {}

  public async execute(): Promise<Result<{ processed: number; totalInterest: number }, Error>> {
    const savingsResult = await this.savingRepository.findAll();
    
    if (!savingsResult.ok) {
      return err(new Error('Erreur lors de la récupération des comptes épargne'));
    }

    const savings = savingsResult.value;
    let processedCount = 0;
    let totalInterestAdded = 0;

    for (const saving of savings) {
      // Calcul intérêt journalier
      // Formule : balance * (rate / 10000) / 365
      // rate est en basis points (250 = 2.5%)
      // balance est en centimes
      
      const annualRate = saving.rate / 10000; // 250 → 0.025 (2.5%)
      const dailyInterest = Math.round((saving.balance * annualRate) / 365);

      if (dailyInterest <= 0) {
        continue; 
      }

      const newBalance = saving.balance + dailyInterest;
      const updateResult = await this.savingRepository.updateBalance(saving.id, newBalance);

      if (!updateResult.ok) {
        console.error(`Erreur lors de la mise à jour du solde pour l'épargne ${saving.id}`);
        continue;
      }

      const interestOperation = {
        id: randomUUID(),
        fromAccountId: null,
        toAccountId: saving.accountId,
        amount: dailyInterest,
        type: 'CREDIT',
        description: `Intérêts journaliers épargne (${(saving.rate / 100).toFixed(2)}%)`,
      };

      const operationResult = await this.operationRepository.save(interestOperation);
      if (operationResult.ok) {
        processedCount++;
        totalInterestAdded += dailyInterest;
      }
    }

    return ok({
      processed: processedCount,
      totalInterest: totalInterestAdded,
    });
  }
}
