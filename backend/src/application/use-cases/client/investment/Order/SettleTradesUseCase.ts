import { randomUUID } from "crypto";
import { Transaction } from "../../../../../domain/entities/Transaction";
import { BankAccountRepository } from "../../../../ports/repositories/BankAccountRepository";
import { PortfolioRepository } from "../../../../ports/repositories/PortfolioRepository";
import { TradeRepository } from "../../../../ports/repositories/TradeRepository";
import { TransactionRepository } from "../../../../ports/repositories/TransactionRepository";

export class SettleTradesUseCase {
  constructor(
    private readonly tradeRepository: TradeRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly transactionRepository: TransactionRepository // Ton entité
  ) {}

  async execute(): Promise<void> {
    const tradesToSettle = await this.tradeRepository.findPendingSettlement();
    if(!tradesToSettle.ok){
      throw tradesToSettle.error;
    }

    for (const trade of tradesToSettle.value) {
      // 1. Trouver les infos de l'acheteur (buyer) et du vendeur (seller)
      const buyerPortfolio = await this.portfolioRepository.findByClientId(trade.buyOrderIdentifier);
      if(!buyerPortfolio.ok){
        throw buyerPortfolio.error;
      }

      const buyerAccount = await this.bankAccountRepository.findDefaultAccountByClientId(trade.buyOrderIdentifier);
      if(!buyerAccount.ok){
        throw buyerAccount.error;
      }

      const sellerPortfolio = await this.portfolioRepository.findByClientId(trade.sellOrderIdentifier);
      if(!sellerPortfolio.ok){
        throw sellerPortfolio.error;
      }

      const sellerAccount = await this.bankAccountRepository.findDefaultAccountByClientId(trade.sellOrderIdentifier);
      if(!sellerAccount.ok){
        throw sellerAccount.error;
      }

      const tradeValue = trade.quantity * trade.price;
      const fee = 100; // 1€ de frais en centimes
      const totalDebit = tradeValue + fee;

      // 2. Déplacer l'argent
      buyerAccount.value.withdraw(totalDebit);
      sellerAccount.value.deposit(tradeValue);

      // 3. Créer les traces de paiement (Ton entité Transaction)
      const buyerTransactionIdentifier = randomUUID();
      const sellerTransactionIdentifier = randomUUID();
      const buyerTransaction = Transaction.create({
        transactionIdentifier: buyerTransactionIdentifier,
        bankAccountIdentifier: buyerAccount.value.accountIdentifier,
        amount: totalDebit,
        currency: "EUR",
        direction: "DEBIT",
        type: "STOCK_PURCHASE",
        description: "buy of stocks",
        date: new Date()
      }
      );

      const sellerTransaction = Transaction.create({
        transactionIdentifier: sellerTransactionIdentifier,
        bankAccountIdentifier: sellerAccount.value.accountIdentifier,
        amount: tradeValue,
        currency: "EUR",
        direction: "CREDIT",
        type: "STOCK_SALE",
        description: "Sale of stocks",
        date: new Date()
      });

      // 4. Déplacer les actions
      sellerPortfolio.value.removeHolding(trade.stockIdentifier, trade.quantity);
      buyerPortfolio.value.addHolding(trade.stockIdentifier, trade.quantity);
      
      // 5. Marquer le trade comme réglé
      trade.status = "SETTLED";

      // 6. Sauvegarder toutes les entités modifiées
      await this.bankAccountRepository.save(buyerAccount.value);
      await this.bankAccountRepository.save(sellerAccount.value);
      await this.portfolioRepository.save(buyerPortfolio.value);
      await this.portfolioRepository.save(sellerPortfolio.value);
      await this.transactionRepository.save(buyerTransaction);
      await this.transactionRepository.save(sellerTransaction);
      await this.tradeRepository.save(trade);
    }
  }
}