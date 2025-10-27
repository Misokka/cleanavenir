import { randomUUID } from "crypto";
import { Transaction } from "../../../../../domain/entities/Transaction";
import { err } from "../../../../../shared/Result";
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
      const buyerPortfolio = await this.portfolioRepository.findByClientId(trade.buyOrderId);
      if(!buyerPortfolio.ok){
        throw buyerPortfolio.error;
      }

      const buyerAccount = await this.bankAccountRepository.findDefaultAccountByClientId(trade.buyOrderId);
      if(!buyerAccount.ok){
        throw buyerAccount.error;
      }

      const sellerPortfolio = await this.portfolioRepository.findByClientId(trade.sellOrderId);
      if(!sellerPortfolio.ok){
        throw sellerPortfolio.error;
      }

      const sellerAccount = await this.bankAccountRepository.findDefaultAccountByClientId(trade.sellOrderId);
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
      const buyerTransaction = new Transaction(
        buyerTransactionIdentifier,
        buyerAccount.value.accountIdentifier,
        totalDebit,
        "DEBIT",
        "STOCK_PURCHASE",
        "buy of stocks"
      );

      const sellerTransaction = new Transaction(
        sellerTransactionIdentifier,
        sellerAccount.value.accountIdentifier,
        tradeValue,
        "CREDIT",
        "STOCK_SALE",
        "Sale of stocks"
      );

      // 4. Déplacer les actions
      sellerPortfolio.value.removeHolding(trade.stockId, trade.quantity);
      buyerPortfolio.value.addHolding(trade.stockId, trade.quantity);
      
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