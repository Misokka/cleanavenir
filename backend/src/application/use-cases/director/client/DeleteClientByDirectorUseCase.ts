import { UserRepository } from "../../../ports/repositories/UserRepository";
import { ClientRepository } from "../../../ports/repositories/ClientRepository";
import { BankAccountRepository } from "../../../ports/repositories/BankAccountRepository";
import { SavingAccountRepository } from "../../../ports/repositories/SavingAccountRepository";
import { LoanRepository } from "../../../ports/repositories/LoanRepository";
import { PortfolioRepository } from "../../../ports/repositories/PortfolioRepository";
import { OrderRepository } from "../../../ports/repositories/OrderRepository";
import { TransactionRepository } from "../../../ports/repositories/TransactionRepository";
import { err, ok, Result } from "../../../../shared/Result";


export class DeleteClientByDirectorUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly savingRepository: SavingAccountRepository,
    private readonly loanRepository: LoanRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly orderRepository: OrderRepository,
    private readonly transactionRepository: TransactionRepository
  ) {}

  public async execute(userId: string): Promise<Result<boolean, Error>> {
    
    const userResult = await this.userRepository.findById(userId);
    if (!userResult.ok) {
      return err(new Error("Utilisateur introuvable"));
    }

    const user = userResult.value;

    if (user.role !== "CLIENT") {
      return err(new Error("Seuls les comptes clients peuvent être supprimés via cette interface"));
    }

    const clientResult = await this.clientRepository.findByUserId(userId);
    if (!clientResult.ok) {
      return err(new Error("Profile client introuvable"));
    }

    const client = clientResult.value;
    const clientId = client.clientIdentifier;

    try {
      const ordersResult = await this.orderRepository.listByUser(clientId);
      if (ordersResult.ok && ordersResult.value.length > 0) {
        for (const order of ordersResult.value) {
          await this.orderRepository.delete(order.orderIdentifier);
        }
      }

      const portfolioResult = await this.portfolioRepository.findByClientId(clientId);
      if (portfolioResult.ok) {
        await this.portfolioRepository.delete(portfolioResult.value.portfolioIdentifier);
      }

      const loansResult = await this.loanRepository.findAllByUserId(userId);
      if (loansResult.ok && loansResult.value.length > 0) {
        for (const loan of loansResult.value) {
          await this.loanRepository.delete(loan.loanIdentifier);
        }
      }

      const savingsResult = await this.savingRepository.findManyByOwner(clientId);
      if (savingsResult.ok && savingsResult.value.length > 0) {
        for (const saving of savingsResult.value) {
          await this.savingRepository.delete(saving.accountIdentifier);
        }
      }

      const accountsResult = await this.bankAccountRepository.findByOwner(clientId);
      if (accountsResult.ok && accountsResult.value.length > 0) {
        for (const account of accountsResult.value) {
          const transactionsResult = await this.transactionRepository.listForAccount(account.accountIdentifier);
          if (transactionsResult.ok && transactionsResult.value.length > 0) {
            for (const transaction of transactionsResult.value) {
              await this.transactionRepository.delete(transaction.transactionIdentifier);
            }
          }
          await this.bankAccountRepository.delete(account.accountIdentifier);
        }
      }

      const deleteClientResult = await this.clientRepository.delete(clientId);
      if (!deleteClientResult.ok) {
        return err(new Error("Erreur lors de la suppression du profil client"));
      }

      const deleteResult = await this.userRepository.delete(user.userIdentifier);
      if (!deleteResult.ok) {
        return err(new Error("Erreur lors de la suppression de l'utilisateur"));
      }

      return ok(true);
    } catch (error) {
      console.error("Erreur lors de la suppression en cascade:", error);
      return err(new Error("Erreur lors de la suppression du client et de ses données"));
    }
  }
}
