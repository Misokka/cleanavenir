import { UserDTO } from '../../../application/dtos/UserDTO';
import { AccountDTO } from '../../../application/dtos/AccountDTO';
import { TransactionDTO } from '../../../application/dtos/TransactionDTO';
import { SavingAccountDTO } from '../../../application/dtos/SavingAccountDTO';
import { User, UserRole } from '../../../domain/entities/User';
import { BankAccount } from '../../../domain/entities/BankAccount';
import { Transaction } from '../../../domain/entities/Transaction';
import { SavingAccount } from '../../../domain/entities/SavingAccount';
import { SavingProduct } from '../../../domain/entities/SavingProduct';
import { SavingProductDTO } from '../../../application/dtos/SavingProductDTO';
import { CompanyDTO } from '../../../application/dtos/CompanyDTO';
import { Company } from '../../../domain/entities/Company';
import { Stock } from '../../../domain/entities/Stock';
import { StockDTO } from '../../../application/dtos/StockDTO';
import { Order } from '../../../domain/entities/Order';
import { OrderDTO } from '../../../application/dtos/OrderDTO';
import { ORDER_FEES } from '../../../shared/constants/Investment';
import { Portfolio } from '../../../domain/entities/Portfolio';
import { holdings } from '../../../infrastructure/drizzle/schema';
import { Holding } from '../../../domain/entities/Holding';
import { ChargedPortfolio, HoldingWithStock } from '../../../application/use-cases/client/investment/portfolio/GetMyPortfolioUseCase';

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.userIdentifier,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role as UserRole,
    isActive: user.active,
    emailVerifiedAt: user.emailVerifiedAt as string | null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt?.toISOString() as string,
  };
}

export function toAccountDTO(account: BankAccount): AccountDTO {
  return {
    id: account.accountIdentifier,
    iban: account.iban.value,
    label: account.label, 
    balance: account.balance / 100, 
    currency: 'EUR',
  };
}

export function toOperationDTO(transaction: Transaction): TransactionDTO {
  const kind: 'CREDIT' | 'DEBIT' = 
    transaction.direction === 'CREDIT' || !transaction.fromAccountIdentifier ? 'CREDIT' : 'DEBIT';

  const accountId = kind === 'CREDIT' 
    ? (transaction.toAccountIdentifier || '') 
    : (transaction.fromAccountIdentifier || '');

  return {
    id: transaction.transactionIdentifier,
    accountId: accountId,
    kind,
    amount: Math.abs(transaction.amount) / 100, 
    currency: 'EUR',
    label: transaction.description || 'Opération',
    createdAt: transaction.createdAt.toISOString(),
  };
}

export function toSavingAccountDTO(saving: SavingAccount): SavingAccountDTO {
  return {
    id: saving.accountIdentifier,
    iban: saving.iban.value,
    ownerId: saving.clientIdentifier,
    label: saving.label,
    balance: saving.balance / 100, // à voir pour convertir en € ou centimes
    savingProductId: saving.productIdentifier,
    createdAt: saving.createdAt.toISOString(),
  };
}

export function toSavingProductDTO(savingProduct: SavingProduct): SavingProductDTO{
  return {
    ...savingProduct,
    id: savingProduct.savingProductIdentifier,
    rate: savingProduct.rate / 1_000_000, // conversion de micro pourcent à pourcent
  }
}

export function toCompanyDTO(company: Company): CompanyDTO {
  return {
    id: company.companyIdentifier,
    name: company.name,
    description: company.description,
  };
}

export function toStockDTO(stock: Stock, company: Company): StockDTO{
  return{
    id: stock.stockIdentifier,
    ticker: stock.ticker.value,
    price: stock.price / 100, // conversion en euros
    isAvailable: stock.isAvailable,
    createdAt: stock.createdAt.toISOString(),
    updatedAt: stock.updatedAt?.toISOString() as string,
    company: toCompanyDTO(company),
  }
}

export function toOrderDTO(order: Order, stock: Stock): OrderDTO{
  return {
    id: order.orderIdentifier,
    userId: order.clientIdentifier,
    stockId: order.stockIdentifier,
    stockName: stock.ticker.value,
    type: order.orderType,
    initialQuantity: order.initialQuantity,
    remainingQuanity: order.remainingQuantity,
    status: order.status,
    limitPrice: order.limitPrice / 100,
    fees: ORDER_FEES,
    blockedMoneyAmount: (order.blockedMoneyAmount ?? 0) / 100,
    blockedStockQuantity: order.blockedStockQuantity,
    createdAt: order.createdAt.toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export function toPortfolioDTO(portfolio: Portfolio) {
  return {
    id: portfolio.portfolioIdentifier,
    ownerId: portfolio.clientIdentifier,
    holdings: portfolio.allHoldings().map(toHoldingPortfolioDTO),
    createdAt: portfolio.createdAt
  }
}

export function toHoldingPortfolioDTO(holding: Holding){
  return {
    id: holding.holdingIdentifier,
    portfolioId: holding.portfolioIdentifier,
    stockId: holding.stockIdentifier,
    quantity: holding.quantity,
    averagePrice: holding.averagePrice / 100
  }
}

export function toChargedPortfolioDTO(chargedPortfolio: ChargedPortfolio){
  return {
    id: chargedPortfolio.portfolioIdentifier,
    ownerId: chargedPortfolio.clientIdentifier,
    holdings: chargedPortfolio.holdingsWithStock.map(toHoldingWithStockDTO),
    createdAt: chargedPortfolio.createdAt
  }
}

export function toHoldingWithStockDTO(holding: HoldingWithStock){
  return{
    id: holding.holdingIdentifier,
    portfolioId: holding.portfolioIdentifier,
    quantity: holding.quantity,
    averagePrice: holding.averagePrice / 100,
    stock: toStockDTO(holding.stockWithCompany.stock, holding.stockWithCompany.company)

  }
}